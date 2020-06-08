import React, { useCallback, useMemo, useReducer, useState } from 'react'
import { Decimal } from 'decimal.js'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  Help,
  Info,
  Tabs,
  TextInput,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import {
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
} from '..'

const TABS = ['Overview', 'Advanced']
const INPUT_MEDIUM = 24 * GU

const DEFAULT_VALUES = {
  cliffPeriod: 90,
  expectedGrowth: 200,
  fundingPeriod: 14,
  initialPricePerToken: 1,
  targetGoal: 25000,
  presalePrice: 1,
  tokensOffered: 90,
  projectFunding: 10,
  vestingSchedule: 365,
  batchLength: 1,
  slippageDai: 25,
  slippageAnt: 100,
  tapRate: 2500,
  tapFloor: 2500,
  maximumMonthlyUpdates: 50,
}

function BN(value) {
  return new Decimal(value)
}

function labelDays(value) {
  return value === 1 ? 'Day' : 'Days'
}

function labelBatch(value) {
  return value === 1 ? 'Block' : 'Blocks'
}

function def(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

function intDef(value, defaultValue = 0) {
  const intValue = parseInt(value, 10)
  return isNaN(intValue) ? defaultValue : intValue
}

function floatDef(value, defaultValue = 0) {
  const floatValue = parseFloat(value)
  return isNaN(floatValue) ? defaultValue : floatValue
}

function dataDefaults(data) {
  return Object.keys(DEFAULT_VALUES).reduce(
    (_data, fieldName) => ({
      ..._data,
      [fieldName]: def(data[fieldName], DEFAULT_VALUES[fieldName]),
    }),
    {}
  )
}

function updateMinimumGrowth(fields) {
  const oneDAI = BN(10).pow(BN(18))
  const one = BN(1)
  const two = BN(2)
  const oneHundred = BN(100)
  const cwDAI = BN(0.1)

  const xRate = one.div(BN(fields.presalePrice))
  const goal = BN(fields.targetGoal).times(oneDAI)
  const pctOffered = BN(fields.tokensOffered).div(oneHundred)
  const pctBeneficiary = BN(fields.projectFunding).div(oneHundred)

  const sPrice = BN(fields.initialPricePerToken)
  const sSupply = goal.times(xRate).div(pctOffered)
  const sBalance = goal.times(one.minus(pctBeneficiary))

  const exponent = two
    .times(cwDAI)
    .minus(two)
    .div(two.times(cwDAI).minus(one))

  return sBalance
    .times(sSupply.pow(one.minus(cwDAI).div(cwDAI.minus(one))))
    .div(cwDAI.mul(sPrice))
    .pow(exponent)
    .add(one)
}

function reduceFields(fields, [field, value]) {
  const updateField = value => ({ ...fields, [field]: value })

  if (
    field === 'tapFloor' ||
    field === 'expectedGrowth' ||
    field === 'projectFunding'
  ) {
    return updateField(intDef(value))
  }

  if (
    field === 'batchLength' ||
    field === 'slippageDai' ||
    field === 'slippageAnt' ||
    field === 'tapRate' ||
    field === 'maximumMonthlyUpdates' ||
    field === 'targetGoal' ||
    field === 'tokensOffered' ||
    field === 'vestingSchedule' ||
    field === 'cliffPeriod' ||
    field === 'fundingPeriod'
  ) {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'presalePrice' || field === 'initialPricePerToken') {
    return updateField(Math.max(0.1, floatDef(value)))
  }

  return fields
}

function useConfigureFields(data) {
  const [fields, _update] = useReducer(reduceFields, dataDefaults(data))

  // Update a field by using its name and value as parameters
  const update = useCallback((...params) => _update(params), [])

  // Bind the update function to a callback passing the value, e.g.:
  //
  //  <PercentageField
  //   onChange={bindUpdate('fieldName')}
  //   value={fieldValue}
  //  />
  //

  const bindUpdate = useCallback(name => value => update(name, value), [update])

  return { fields, update, bindUpdate }
}

function validationError(fields) {
  if (fields.fundingPeriod >= fields.cliffPeriod) {
    return 'Please make sure the cliff period is longer than the presale funding period.'
  }
  if (fields.cliffPeriod >= fields.vestingSchedule) {
    return 'Please make sure the vesting schedule is longer than the cliff period.'
  }
  return null
}

function FundraisingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [tab, setTab] = useState(0)
  const [formError, setFormError] = useState(null)

  const { fields, bindUpdate } = useConfigureFields(screenData || {})

  const minimumGrowth = useMemo(() => updateMinimumGrowth(fields), [fields])

  const acceptableMinimumGrowth = useMemo(() => {
    if (minimumGrowth.gte(fields.expectedGrowth)) {
      return false
    }
    return true
  }, [fields, minimumGrowth])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const error = validationError(fields)
      setFormError(error)

      if (!error) {
        const screenData = {
          ...fields,
          minimumGrowth: minimumGrowth.toFixed(0),
        }
        const mergedData = dataKey
          ? { ...data, [dataKey]: screenData }
          : { ...data, ...screenData }

        next(mergedData)
      }
    },
    [data, dataKey, fields, minimumGrowth, next]
  )

  return (
    <form css="width: 100%">
      <Header
        title="Configure fundraising"
        subtitle={
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            Choose your
            <span
              css={`
                display: flex;
                margin: 0 ${1.5 * GU}px;
              `}
            >
              <KnownAppBadge
                appName="aragon-fundraising.aragonpm.eth"
                label="Fundraising"
              />
            </span>
            settings below.
          </span>
        }
      />

      <Tabs items={TABS} selected={tab} onChange={setTab} />
      {tab === 0 && (
        <div>
          <Section title="Presale terms">
            <Info
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              <p>
                Your fundraising campaign will start with a presale during which
                the organization's {data.holders.tokenSymbol} tokens will be
                sold at a constant price. If the presale succeeds in reaching
                the goal within its time period, trading will open. Otherwise,
                your fundraising campaign will abort with contributors allocated
                refunds.
              </p>
            </Info>
            <div css="display: flex">
              <InlineField
                key="targetGoal"
                label={
                  <React.Fragment>
                    Presale goal
                    <Help hint="What is Presale Goal?">
                      <strong>Presale Goal</strong> describes the amount of DAI
                      that must be raised during the presale period for it to
                      succeed. <em>For example: 50000 DAI.</em>
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label="DAI"
                    onChange={bindUpdate('targetGoal')}
                    value={fields.targetGoal}
                  />
                )}
              </InlineField>
              <InlineField
                key="presalePrice"
                label={
                  <React.Fragment>
                    Presale price
                    <Help hint="What is Presale Price?">
                      <p>
                        <strong>Presale Price</strong> is the constant price (in
                        DAI) the organization's {data.holders.tokenSymbol}{' '}
                        tokens will be sold at during the presale.{' '}
                        <em>
                          For example: 3 DAI per {data.holders.tokenSymbol}.
                        </em>
                      </p>
                      <p
                        css={`
                          margin-top: ${1 * GU}px;
                        `}
                      >
                        Later on, if the presale succeeds and trading opens, the
                        price of the organization's {data.holders.tokenSymbol}{' '}
                        tokens will be dynamically adjusted based on the market.
                      </p>
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label={`DAI per ${data.holders.tokenSymbol}`}
                    onChange={bindUpdate('presalePrice')}
                    value={fields.presalePrice}
                  />
                )}
              </InlineField>
              <InlineField
                key="fundingPeriod"
                label={
                  <React.Fragment>
                    Presale period
                    <Help hint="What is Presale Period?">
                      <strong>Presale Period</strong> describes the length of
                      time the presale will be open.{' '}
                      <em>For example: 30 days.</em>
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label={labelDays(fields.fundingPeriod)}
                    onChange={bindUpdate('fundingPeriod')}
                    value={
                      fields.fundingPeriod === -1 ? '' : fields.fundingPeriod
                    }
                  />
                )}
              </InlineField>
            </div>
            <PercentageField
              label={
                <React.Fragment>
                  Initial tokens offered %
                  <Help hint="What is Initial Tokens Offered %?">
                    <strong>Initial Tokens Offered %</strong> describes the
                    percentage of the initial {data.holders.tokenSymbol} token
                    supply that will be offered during the presale. The
                    remainder of this supply will be minted and sent to the
                    council if the presale succeeds.
                  </Help>
                </React.Fragment>
              }
              value={fields.tokensOffered}
              onChange={bindUpdate('tokensOffered')}
            />
            <PercentageField
              label={
                <React.Fragment>
                  Project funding %
                  <Help hint="What is Project Funding %?">
                    <strong>Project Funding %</strong> describes the percentage
                    of DAI raised during the presale that will be sent to the
                    council (to bootstrap the campaign's underlying project) if
                    the presale succeeds. The remainder of the raised DAI will
                    be sent to the automated market maker's reserve pool to
                    support trading of ${data.holders.tokenSymbol}.
                  </Help>
                </React.Fragment>
              }
              value={fields.projectFunding}
              onChange={bindUpdate('projectFunding')}
            />
          </Section>

          <Section title="Contribution terms">
            <Info
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              <p>
                {data.holders.tokenSymbol} tokens purchased during the presale
                will be vested and thus un-transferable as long as the vesting
                cliff period has not been reached. The amount of{' '}
                {data.holders.tokenSymbol} tokens that are unlocked at the cliff
                is directly proportional to the overall vesting schedule.
              </p>
              <p
                css={`
                  margin-top: ${1 * GU}px;
                `}
              >
                When the vesting schedule completes, all{' '}
                {data.holders.tokenSymbol} tokens will become transferable.
              </p>
            </Info>
            <div css="display: flex">
              <InlineField
                label={
                  <React.Fragment>
                    Cliff period
                    <Help hint="What is Cliff Period?">
                      <strong>Cliff Period</strong> describes the length of time
                      required before any {data.holders.tokenSymbol} tokens
                      purchased during the presale become transferable.{' '}
                      <em>For example: {fields.fundingPeriod + 15} days.</em>
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label={labelDays(fields.cliffPeriod)}
                    onChange={bindUpdate('cliffPeriod')}
                    value={fields.cliffPeriod === -1 ? '' : fields.cliffPeriod}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
              <InlineField
                label={
                  <React.Fragment>
                    Vesting schedule
                    <Help hint="What is Vesting Schedule?">
                      <strong>Vesting schedule</strong> describes the length of
                      time required for all {data.holders.tokenSymbol} tokens
                      purchased during the presale to become transferable.{' '}
                      <em>For example: {fields.cliffPeriod + 30} days.</em>
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label={labelDays(fields.vestingSchedule)}
                    onChange={bindUpdate('vestingSchedule')}
                    value={
                      fields.vestingSchedule === -1
                        ? ''
                        : fields.vestingSchedule
                    }
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
            </div>
          </Section>

          <Section title="Operation terms">
            <Info
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              <p>
                The funds collected by the fundraising campaign are released
                over time to a council-controlled vault to sustain the
                underlying project. This mechanism is called the <em>tap</em>{' '}
                and can be configured over time.
              </p>
            </Info>
            <Field
              label={
                <React.Fragment>
                  Initial tap rate
                  <Help hint="What is Tap Rate?">
                    <p>
                      <strong>Tap Rate</strong> defines the amount of DAI which
                      can be released every month from the market-maker's
                      reserve pool to the council-controlled vault.{' '}
                      <em>For example: 3000 DAI / month.</em>
                    </p>
                    <p
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                    >
                      This is the flow of funds that will actually support the
                      campaign's underlying project.
                    </p>
                  </Help>
                </React.Fragment>
              }
            >
              {({ id }) => (
                <ConfigInput
                  id={id}
                  label="DAI"
                  onChange={bindUpdate('tapRate')}
                  value={fields.tapRate}
                  width={INPUT_MEDIUM}
                />
              )}
            </Field>
            <Field
              label={
                <React.Fragment>
                  Initial tap floor
                  <Help hint="What is Tap Floor?">
                    <p>
                      <strong>Tap Floor</strong> defines the amount of DAI which
                      will be kept in the market-maker's reserve pool regardless
                      of the tap rate. <em>For example: 5000 DAI.</em>
                    </p>
                    <p
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                    >
                      This ensures that the market-maker's reserve pool can't be
                      emptied - and thus that the {data.holders.tokenSymbol}{' '}
                      price can't fall down all the way to zero - even if over a
                      long period of time.
                    </p>
                  </Help>
                </React.Fragment>
              }
            >
              {({ id }) => (
                <ConfigInput
                  id={id}
                  label="DAI"
                  onChange={bindUpdate('tapFloor')}
                  value={fields.tapFloor}
                  width={INPUT_MEDIUM}
                />
              )}
            </Field>
            <PercentageField
              label={
                <React.Fragment>
                  Maximum monthly tap rate increases and tap floor decreases %
                  <Help hint="What is the maximum monthly tap rate increases and tap floor decreases %?">
                    <p>
                      <strong>
                        Maximum monthly tap rate increases and tap floor
                        decreases
                      </strong>{' '}
                      defines how fast you can increase the tap rate and
                      decrease the tap floor each month.{' '}
                      <em>For example: 50%.</em>
                    </p>
                    <p
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                    >
                      This protects holders by controlling how quickly the flow
                      of funds from the market-maker's reserve pool to the
                      council-controlled vault can evolve.
                    </p>
                  </Help>
                </React.Fragment>
              }
              value={fields.maximumMonthlyUpdates}
              onChange={bindUpdate('maximumMonthlyUpdates')}
            />
          </Section>

          <Section title="Trading terms">
            <Info
              mode={acceptableMinimumGrowth ? 'info' : 'warning'}
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              <p>
                The current minimum growth is{' '}
                <strong>{minimumGrowth.toFixed(0)} times</strong> the
                organization's initial market capitalization. This value is
                calculated from the presale price, presale goal, initial token %
                offered, project funding %, and initial trading price per{' '}
                {data.holders.tokenSymbol}.
              </p>
              {!acceptableMinimumGrowth && (
                <p
                  css={`
                    margin-top: ${1 * GU}px;
                  `}
                >
                  <strong>
                    Please adjust the mentioned parameters to change the
                    expected growth ({fields.expectedGrowth}) to be greater than
                    the minimum growth ({minimumGrowth.toFixed(0)}).
                  </strong>
                </p>
              )}
            </Info>
            <div css="display: flex">
              <InlineField
                label={
                  <React.Fragment>
                    Initial price per {data.holders.tokenSymbol}
                    <Help
                      hint={`What is Initial Price per ${data.holders.tokenSymbol}?`}
                    >
                      <strong>
                        Initial Price per {data.holders.tokenSymbol}
                      </strong>{' '}
                      will be the price in DAI for each{' '}
                      {data.holders.tokenSymbol} token when trading initially
                      opens. Afterwards, the price will automatically adjust
                      according to the market.
                    </Help>
                  </React.Fragment>
                }
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label={`DAI per ${data.holders.tokenSymbol}`}
                    onChange={bindUpdate('initialPricePerToken')}
                    value={fields.initialPricePerToken}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
              <InlineField
                label={
                  <React.Fragment>
                    Expected growth
                    <Help hint="What is Expected Growth?">
                      <p>
                        <strong>Expected Growth</strong> is the expected
                        long-term market capitalization growth of{' '}
                        {data.holders.tokenSymbol}. We use this value to set the
                        parameterization of {data.holders.tokenSymbol}'s bonding
                        curve such that the token's price will be 10x its
                        initial trading price once its reached this
                        capitalization.
                      </p>
                      <p
                        css={`
                          margin-top: ${1 * GU}px;
                        `}
                      >
                        Setting a high expected growth will cause the bonding
                        curve attached to {data.holders.tokenSymbol} to be{' '}
                        <em>more sensitive</em> to volatility.
                      </p>
                    </Help>
                  </React.Fragment>
                }
                css={`
                  flex-grow: 1;
                  width: 100%;
                `}
              >
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label="Times Initial Market Cap"
                    onChange={bindUpdate('expectedGrowth')}
                    value={fields.expectedGrowth}
                    wide
                  />
                )}
              </InlineField>
            </div>
          </Section>
        </div>
      )}

      {tab === 1 && (
        <div>
          <Section title="Market making terms">
            <Field
              label={
                <React.Fragment>
                  Batch length
                  <Help hint="What is Batch Length?">
                    <p>
                      <strong>Batch length</strong> defines the number of blocks
                      a trading batch will last. <em>For example: 2 blocks.</em>{' '}
                    </p>
                    <p
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                    >
                      All orders opened during a given batch will be matched at
                      the exact same price (though this price may be different
                      for buy and sell orders). This prevents front-running
                      attacks and enables slow trading.
                    </p>
                  </Help>
                </React.Fragment>
              }
            >
              {({ id }) => (
                <ConfigInput
                  id={id}
                  width={INPUT_MEDIUM}
                  label={labelBatch(fields.batchLength)}
                  value={fields.batchLength}
                  onChange={bindUpdate('batchLength')}
                />
              )}
            </Field>
            <div css="display: flex">
              <InlineField label={<SlippageLabel slippageToken="DAI" />}>
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label="%"
                    onChange={bindUpdate('slippageDai')}
                    value={fields.slippageDai}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
              <InlineField label={<SlippageLabel slippageToken="ANT" />}>
                {({ id }) => (
                  <ConfigInput
                    id={id}
                    label="%"
                    onChange={bindUpdate('slippageAnt')}
                    value={fields.slippageAnt}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
            </div>
          </Section>
        </div>
      )}
      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}
      <Navigation
        backEnabled
        nextEnabled={acceptableMinimumGrowth}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

FundraisingScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

FundraisingScreen.defaultProps = {
  dataKey: 'fundraising',
}

/* eslint-disable react/prop-types */

function Section({ title, children }) {
  const theme = useTheme()
  return (
    <section
      css={`
        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
    >
      <h1
        css={`
          margin: ${3 * GU}px 0;
        `}
      >
        {title}
      </h1>
      <div>{children}</div>
    </section>
  )
}

function InlineField(props) {
  return (
    <Field
      css={`
        & + & {
          margin-left: ${2 * GU}px;
        }
      `}
      {...props}
    />
  )
}

function ConfigInput({
  label = null,
  width = -1,
  labelWidth = 8 * GU,
  onChange,
  onChangeDone = () => null,
  ...props
}) {
  const theme = useTheme()

  const handleChange = useCallback(
    event => {
      onChange(event.target.value)
    },
    [onChange]
  )

  const handleBlur = useCallback(
    event => {
      onChangeDone(event.target.value)
    },
    [onChangeDone]
  )

  return (
    <div
      css={`
        ${width > -1 ? `width: ${width}px` : ''};
        & + & {
          margin-left: ${2 * GU}px;
        }
      `}
    >
      <TextInput
        adornment={
          label && (
            <span
              css={`
                padding: 0 ${1.5 * GU}px;
                color: ${theme.contentSecondary};
              `}
            >
              {label}
            </span>
          )
        }
        adornmentPosition="end"
        adornmentSettings={{ width: labelWidth, padding: 0 }}
        onChange={handleChange}
        onBlur={handleBlur}
        wide
        {...props}
      />
    </div>
  )
}

function SlippageLabel({ slippageToken }) {
  return (
    <React.Fragment>
      {slippageToken} slippage %
      <Help hint={`What is ${slippageToken} Slippage %?`}>
        <p>
          <strong>{slippageToken} Slippage %</strong> defines the maximum price
          slippage in {slippageToken} that may occur on orders during any given
          batch.
        </p>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          For example, with a value of 25%, this would mean that:
        </p>
        <ol
          css={`
            padding-left: ${2 * GU}px;
          `}
        >
          <li>
            The price of any buy orders in a batch can't rise above 125% of the
            batch's opening price
          </li>
          <li>
            The price of any sell orders price in a batch can't fall below 75%
            of the batch's opening price.
          </li>
        </ol>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          Any order that would break these limits will automatically be
          dismissed.
        </p>
      </Help>
    </React.Fragment>
  )
}

function formatReviewFields(screenData) {
  return <ReviewFields data={screenData} />
}

function camelCaseToName(value) {
  return value.replace(/([A-Z])/g, ' $1')
}

function ReviewFields({ data }) {
  const theme = useTheme()
  const { below } = useViewport()
  return (
    <div
      css={`
        width: 100%;
        padding: ${3 * GU}px 0;
      `}
    >
      {[
        {
          group: 'Presale terms',
          fields: [
            ['targetGoal', 'DAI', 'Goal'],
            ['presalePrice', 'DAI per token', 'Price'],
            ['fundingPeriod', 'days', 'Period'],
            ['tokensOffered', '%', 'Initial tokens offered'],
            ['projectFunding', '%', 'Project funding'],
          ],
        },
        {
          group: 'Contribution terms',
          fields: [
            ['cliffPeriod', 'days'],
            ['vestingSchedule', 'days'],
          ],
        },
        {
          group: 'Operation terms',
          fields: [
            ['tapRate', 'DAI', 'Initial tap rate'],
            ['tapFloor', 'DAI', 'Initial tap floor'],
            ['maximumMonthlyUpdates', '%', 'Maximum tap monthly updates'],
          ],
        },
        {
          group: 'Trading terms',
          fields: [
            ['initialPricePerToken', 'DAI per token', 'Initial trading price'],
            ['expectedGrowth', 'times'],
          ],
        },
        {
          group: 'Market making terms',
          fields: [
            ['batchLength', 'block(s)'],
            ['slippageDai', '%'],
            ['slippageAnt', '%'],
          ],
        },
      ]
        .map(group => ({
          ...group,
          fields: group.fields.map(([field, unit, label]) => [
            label || camelCaseToName(field),
            `${data[field]} ${unit}`,
          ]),
        }))
        .map(({ group, fields }) => {
          return (
            <section
              key={group}
              css={`
                border: 1px solid ${theme.border};
                & + & {
                  margin-top: ${3 * GU}px;
                }
              `}
            >
              <h1
                css={`
                  display: flex;
                  align-items: center;
                  height: ${7 * GU}px;
                  padding-left: ${3 * GU}px;
                  border-bottom: 1px solid ${theme.border};
                  ${textStyle('body1')};
                `}
              >
                {group}
              </h1>
              <div
                css={`
                  display: grid;
                  grid-template-columns: repeat(
                    ${below('medium') ? '1' : '2'},
                    1fr
                  );
                  grid-gap: ${3 * GU}px;
                  padding: ${3 * GU}px;
                `}
              >
                {fields.map(([label, content]) => (
                  <div key={label}>
                    <h2
                      css={`
                        margin-bottom: ${1 * GU}px;
                        color: ${theme.contentSecondary};
                        ${textStyle('label2')};
                      `}
                    >
                      {label}
                    </h2>
                    <div
                      css={`
                        ${textStyle('body1')};
                      `}
                    >
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
    </div>
  )
}

/* eslint-enable react/prop-types */

FundraisingScreen.formatReviewFields = formatReviewFields
export default FundraisingScreen
