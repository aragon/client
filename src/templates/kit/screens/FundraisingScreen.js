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
  initialPricePerShare: 1,
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

  const sPrice = BN(fields.initialPricePerShare)
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

  if (field === 'presalePrice' || field === 'initialPricePerShare') {
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

function FundraisingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [tab, setTab] = useState(0)
  const [formError, setFormError] = useState()

  const { fields, bindUpdate } = useConfigureFields(screenData || {})

  const minimumGrowth = useMemo(() => updateMinimumGrowth(fields), [fields])

  const acceptableMinimumGrowth = useMemo(() => {
    if (minimumGrowth.gte(fields.expectedGrowth)) {
      return false
    }
    return true
  }, [fields, minimumGrowth])

  const fieldsAreValid = useMemo(() => {
    const error = validationError(fields)
    setFormError(error)

    if (minimumGrowth.gte(fields.expectedGrowth)) {
      return false
    }

    if (fields.fundingPeriod >= fields.cliffPeriod) {
      return false
    }

    if (fields.cliffPeriod >= fields.vestingSchedule) {
      return false
    }

    return true
  }, [fields, minimumGrowth])

  function validationError(fields) {
    if (fields.fundingPeriod >= fields.cliffPeriod) {
      return 'Please make sure the cliff period is longer than the presale funding period.'
    }
    if (fields.cliffPeriod >= fields.vestingSchedule) {
      return 'Please make sure the vesting schedule is longer than the cliff period.'
    }
    return null
  }

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
    [data, dataKey, fields, next, minimumGrowth]
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
                your {data.share.tokenSymbol} tokens will be sold at a constant
                price. If your presale succeeds to reach its goal within its
                time period, trading will open. Otherwise, your fundraising
                campaign will abort and contributors may ask for refund.
              </p>
            </Info>
            <div css="display: flex">
              <InlineField
                key="targetGoal"
                label={
                  <React.Fragment>
                    Presale goal
                    <Help hint="What’s the presale goal?">
                      <strong>Presale goal</strong> describes the amount of DAI
                      that must be raised during the presale period for it to
                      succeed. <i>For example: 50000 DAI.</i>
                    </Help>
                  </React.Fragment>
                }
              >
                <ConfigInput
                  label="DAI"
                  onChange={bindUpdate('targetGoal')}
                  value={fields.targetGoal}
                />
              </InlineField>
              <InlineField
                key="presalePrice"
                label={
                  <React.Fragment>
                    Presale price
                    <Help hint="What’s the presale price?">
                      <strong>Presale price</strong> is the constant price in
                      DAI at which your {data.share.tokenSymbol} tokens will be
                      sold during the presale.{' '}
                      <i>For example: 3 DAI per {data.share.tokenSymbol}.</i>{' '}
                      Later on, if the presale succeeds and trading opens, price
                      will be dynamically adjusted according to the{' '}
                      {data.share.tokenSymbol} supply.
                    </Help>
                  </React.Fragment>
                }
              >
                <ConfigInput
                  label={`DAI per ${data.share.tokenSymbol}`}
                  onChange={bindUpdate('presalePrice')}
                  value={fields.presalePrice}
                />
              </InlineField>
              <InlineField
                key="fundingPeriod"
                label={
                  <React.Fragment>
                    Presale period
                    <Help hint="What’s the presale period?">
                      <strong>Presale period</strong> describes the length of
                      time the presale will have to reach its goal.{' '}
                      <i>For example: 30 days.</i>
                    </Help>
                  </React.Fragment>
                }
              >
                <ConfigInput
                  label={labelDays(fields.fundingPeriod)}
                  onChange={bindUpdate('fundingPeriod')}
                  value={
                    fields.fundingPeriod === -1 ? '' : fields.fundingPeriod
                  }
                />
              </InlineField>
            </div>
            <PercentageField
              label={
                <React.Fragment>
                  Initial tokens offered %
                  <Help hint="What’s initial tokens offered %?">
                    <strong>Tokens offered %</strong> describes the percentage
                    of the initial {data.share.tokenSymbol} supply that will be
                    offered during the presale. The remainder of this supply
                    will be minted and sent to the board multisig if and when
                    presale succeeds.
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
                  <Help hint="What’s the project funding %?">
                    <strong>Project funding</strong> describes the percentage of
                    DAI raised during the presale that will be sent to the board
                    multisig [to bootstrap the campaign's underlying project] if
                    and when presale succeeds. The remainder of the raised DAI
                    will be sent to the market maker's reserve pool to support
                    trading.
                  </Help>
                </React.Fragment>
              }
              value={fields.projectFunding}
              onChange={bindUpdate('projectFunding')}
            />
          </Section>

          <Section title="Investment terms">
            <Info
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              <p>
                {data.share.tokenSymbol} tokens purchased during the presale
                will be vested and thus un-transferable as long as the vesting
                cliff period has not been reached. The amount of{' '}
                {data.share.tokenSymbol} tokens that gets unlocked in the cliff
                is directly proportional to the overall vesting schedule. When
                the vesting schedule completes all {data.share.tokenSymbol}{' '}
                tokens are transferable.
              </p>
            </Info>
            <div css="display: flex">
              <InlineField
                label={
                  <React.Fragment>
                    Cliff period
                    <Help hint="What’s the cliff period?">
                      <strong>Cliff period</strong> describes the length of time
                      before which all {data.share.tokenSymbol} tokens purchased
                      during the presale are un-transferable.{' '}
                      <i>For example: {fields.fundingPeriod + 30} days.</i>
                    </Help>
                  </React.Fragment>
                }
              >
                {id => (
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
                    <Help hint="What’s the vesting schedule?">
                      <strong>Vesting schedule</strong> describes the length of
                      time after which all {data.share.tokenSymbol} tokens
                      purchased during the presale are transferable.{' '}
                      <i>For example: {fields.cliffPeriod + 30} days.</i>
                    </Help>
                  </React.Fragment>
                }
              >
                {id => (
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
                calculated from the presale price, presale goal, presale tokens
                offered, presale project funding, and trading initial price per{' '}
                {data.share.tokenSymbol}.
              </p>
              {!acceptableMinimumGrowth && (
                <p
                  css={`
                    margin-top: ${1 * GU}px;
                  `}
                >
                  <strong>
                    Please adjust some parameters to change the expected growth
                    ({fields.expectedGrowth}) to be greater than the minimum
                    growth ({minimumGrowth.toFixed(0)}).
                  </strong>
                </p>
              )}
            </Info>
            <div css="display: flex">
              <InlineField
                label={
                  <React.Fragment>
                    Initial price per {data.share.tokenSymbol}
                    <Help
                      hint={`What’s the initial price per ${data.share.tokenSymbol}`}
                    >
                      <strong>
                        Initial price per {data.share.tokenSymbol}
                      </strong>{' '}
                      is the price in DAI at which {data.share.tokenSymbol}{' '}
                      tokens will initiallly be sold when trading opens.
                      Afterwards, price will automatically adjust according to
                      the {data.share.tokenSymbol} supply.
                    </Help>
                  </React.Fragment>
                }
              >
                {id => (
                  <ConfigInput
                    id={id}
                    label={`DAI per ${data.share.tokenSymbol}`}
                    onChange={bindUpdate('initialPricePerShare')}
                    value={fields.initialPricePerShare}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
              <InlineField
                label={
                  <React.Fragment>
                    Expected growth
                    <Help hint="What's the expected growth?">
                      <strong>Expected growth</strong> is the market cap growth
                      of {data.share.tokenSymbol} tokens you expect in the long
                      term. We expect the price of you {data.share.tokenSymbol}{' '}
                      tokens to have grown of x10 when you reach this growth.
                      Based on this information we can perform fancy computation
                      to derive the parametrization of your bonding curve.
                    </Help>
                  </React.Fragment>
                }
                css={`
                  flex-grow: 1;
                  width: 100%;
                `}
              >
                <ConfigInput
                  label="Times Initial Market Cap"
                  onChange={bindUpdate('expectedGrowth')}
                  value={fields.expectedGrowth}
                  wide
                />
              </InlineField>
            </div>
          </Section>
        </div>
      )}

      {tab === 1 && (
        <div>
          <Section title="Trading terms">
            <Field
              label={
                <React.Fragment>
                  Batch length
                  <Help hint="What’s the batch length?">
                    <strong>Batch length</strong> defines the number of blocks a
                    batch will last. <i>For example: 2 blocks.</i> Orders opened
                    during a given batch will all be matched at the exact same
                    price [though this price may be different for buy and sell
                    orders]. This prevents front-running attacks and enables
                    slow trading.
                  </Help>
                </React.Fragment>
              }
            >
              <ConfigInput
                width={INPUT_MEDIUM}
                label={labelBatch(fields.batchLength)}
                value={fields.batchLength}
                onChange={bindUpdate('batchLength')}
              />
            </Field>
            <div css="display: flex">
              <InlineField
                label={
                  <React.Fragment>
                    DAI slippage %
                    <Help hint="What’s the DAI slippage %?">
                      <strong>DAI slippage %</strong> defines the maximum price
                      slippage that may occur on DAI orders during a batch.{' '}
                      <i>For example: 25%.</i> This would mean that: 1. the buy
                      orders price in a batch can't rise above 125% of what{' '}
                      {data.share.tokenSymbol}'s static price in DAI was at the
                      opening of this batch ; 2. the sell orders price in a
                      batch can't fall below 75% of what{' '}
                      {data.share.tokenSymbol}'s static price in DAI was at the
                      opening of this batch. Any order that would break these
                      limits would automatically be dismissed.
                    </Help>
                  </React.Fragment>
                }
              >
                <ConfigInput
                  label="%"
                  onChange={bindUpdate('slippageDai')}
                  value={fields.slippageDai}
                  width={INPUT_MEDIUM}
                />
              </InlineField>
              <InlineField
                label={
                  <React.Fragment>
                    ANT slippage %
                    <Help hint="What’s the ANT slippage %?">
                      <strong>ANT slippage %</strong> defines the maximum price
                      slippage that may occur on ANT orders during a batch.{' '}
                      <i>For example: 75%.</i> This would mean that: 1. the buy
                      orders price in a batch can't rise above 175% of what{' '}
                      {data.share.tokenSymbol}'s static price in ANT was at the
                      opening of this batch ; 2. the sell orders price in a
                      batch can't fall below 25% of what{' '}
                      {data.share.tokenSymbol}'s static price in ANT was at the
                      opening of this batch. Any order that would break these
                      limits would automatically be dismissed.
                    </Help>
                  </React.Fragment>
                }
              >
                <ConfigInput
                  label="%"
                  onChange={bindUpdate('slippageAnt')}
                  value={fields.slippageAnt}
                  width={INPUT_MEDIUM}
                />
              </InlineField>
            </div>
            <Field
              label={
                <React.Fragment>
                  Initial tap rate
                  <Help hint="What’s the tap rate?">
                    <strong>Tap rate</strong> defines the amount of DAI which
                    can be released every month out of the market-maker reserve
                    to the board's vault. <i>For example: 3000 DAI / month.</i>{' '}
                    This is the flow of funds that will actually support the
                    campaign's underlying project.
                  </Help>
                </React.Fragment>
              }
            >
              <ConfigInput
                label="DAI"
                onChange={bindUpdate('tapRate')}
                value={fields.tapRate}
                width={INPUT_MEDIUM}
              />
            </Field>
            <Field
              label={
                <React.Fragment>
                  Initial tap floor
                  <Help hint="What’s the tap floor?">
                    <strong>Tap floor</strong> defines the amount of DAI which
                    will be kept in the market-maker reserve regardless of the
                    tap rate. <i>For example: 5000 DAI.</i> This ensures that
                    the market-maker reserve pool can't be emptied - and thus
                    that the {data.share.tokenSymbol} price can't fall down to
                    zero - even slowly during a long period of time.
                  </Help>
                </React.Fragment>
              }
            >
              <ConfigInput
                label="DAI"
                onChange={bindUpdate('tapFloor')}
                value={fields.tapFloor}
                width={INPUT_MEDIUM}
              />
            </Field>
            <PercentageField
              label={
                <React.Fragment>
                  Maximum monthly tap rate increases and tap floor decreases %
                  <Help hint="What’s the maximum monthly tap rate increases and tap floor decreases %?">
                    <strong>
                      Maximum monthly tap rate increases and tap floor decreases
                    </strong>{' '}
                    defines how fast you can increase the tap rate and decrease
                    the tap floor each month. <i>For example: 50%.</i> This
                    protect investors by controlling how quickly the flow of
                    funds from the market-maker reserve pool to the board's
                    vault can evolve.
                  </Help>
                </React.Fragment>
              }
              value={fields.maximumMonthlyUpdates}
              onChange={bindUpdate('maximumMonthlyUpdates')}
            />
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
        nextEnabled={fieldsAreValid}
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
            ['presalePrice', 'DAI per share', 'Price per share'],
            ['fundingPeriod', 'days', 'Period'],
            ['tokensOffered', '%', 'Initial tokens offered'],
            ['projectFunding', '%', 'Project funding'],
          ],
        },
        {
          group: 'Investment terms',
          fields: [
            ['cliffPeriod', 'days'],
            ['vestingSchedule', 'days'],
          ],
        },
        {
          group: 'Trading terms',
          fields: [
            ['initialPricePerShare', 'DAI', 'Initial trading price per share'],
            ['expectedGrowth', 'times'],
            ['batchLength', 'blocks'],
            ['slippageDai', '%'],
            ['slippageAnt', '%'],
            ['tapRate', 'DAI', 'Initial tap rate'],
            ['tapFloor', 'DAI', 'Initial tap floor'],
            ['maximumMonthlyUpdates', '%', 'Maximum tap monthly updates'],
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
