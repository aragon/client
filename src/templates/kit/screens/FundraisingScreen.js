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
  initialPricePerShare: 1.1,
  initialPricePerShareInput: '1.1',
  targetGoal: 25000,
  presalePrice: 1,
  presalePriceInput: '1',
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

function updateVestingSchedule(fields, value) {
  const vestingSchedule = Math.max(-1, intDef(value, -1))
  const cliffPeriod = Math.max(
    -1,
    Math.min(fields.cliffPeriod, vestingSchedule - 1)
  )
  const fundingPeriod = Math.max(
    -1,
    Math.min(fields.fundingPeriod, cliffPeriod - 1)
  )
  return { ...fields, cliffPeriod, fundingPeriod, vestingSchedule }
}

function updateCliffPeriod(fields, value) {
  const cliffPeriod = Math.max(-1, intDef(value, -1))
  const fundingPeriod = Math.max(
    -1,
    Math.min(fields.fundingPeriod, cliffPeriod - 1)
  )
  const vestingSchedule = Math.max(-1, fields.vestingSchedule, cliffPeriod + 1)
  return { ...fields, cliffPeriod, fundingPeriod, vestingSchedule }
}

function updateFundingPeriod(fields, value) {
  const fundingPeriod = Math.max(-1, intDef(value))
  const cliffPeriod = Math.max(-1, fields.cliffPeriod, fundingPeriod + 1)
  const vestingSchedule = Math.max(-1, fields.vestingSchedule, cliffPeriod + 1)
  return { ...fields, cliffPeriod, fundingPeriod, vestingSchedule }
}

function updateInitialPricePerShare(fields, value) {
  const initialPricePerShare = Math.max(0.1, floatDef(value))
  const presalePrice = Math.min(fields.presalePrice, initialPricePerShare - 0.1)
  return {
    ...fields,
    initialPricePerShare,
    initialPricePerShareInput: initialPricePerShare,
    presalePrice,
    presalePriceInput: presalePrice,
  }
}

function updatePresalePrice(fields, value) {
  const presalePrice = Math.max(0.1, floatDef(value))
  const initialPricePerShare = Math.max(
    fields.initialPricePerShare,
    presalePrice + 0.1
  )
  return {
    ...fields,
    initialPricePerShare,
    initialPricePerShareInput: initialPricePerShare,
    presalePrice,
    presalePriceInput: presalePrice,
  }
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

  if (field === 'batchLength') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'slippageDai') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'slippageAnt') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'tapRate') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'maximumMonthlyUpdates') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'targetGoal') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'presalePriceInput') {
    return { ...fields, presalePriceInput: value }
  }

  if (field === 'presalePrice') {
    return updatePresalePrice(fields, value)
  }

  if (field === 'initialPricePerShareInput') {
    return { ...fields, initialPricePerShareInput: value }
  }

  if (field === 'initialPricePerShare') {
    return updateInitialPricePerShare(fields, value)
  }

  if (field === 'tokensOffered') {
    return updateField(Math.max(1, intDef(value)))
  }

  if (field === 'vestingSchedule') {
    return updateVestingSchedule(fields, value)
  }

  if (field === 'cliffPeriod') {
    return updateCliffPeriod(fields, value)
  }

  if (field === 'fundingPeriod') {
    return updateFundingPeriod(fields, value)
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

      const screenData = {
        ...fields,
        minimumGrowth: minimumGrowth.toFixed(0),
      }
      const mergedData = dataKey
        ? { ...data, [dataKey]: screenData }
        : { ...data, ...screenData }

      next(mergedData)
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
            <div css="display: flex">
              <InlineField key="targetGoal" label="Target Goal">
                <ConfigInput
                  label="DAI"
                  onChange={bindUpdate('targetGoal')}
                  value={fields.targetGoal}
                />
              </InlineField>
              <InlineField key="presalePrice" label="Price">
                <ConfigInput
                  label="DAI per share"
                  onChange={bindUpdate('presalePriceInput')}
                  onChangeDone={bindUpdate('presalePrice')}
                  value={fields.presalePriceInput}
                />
              </InlineField>
              <InlineField key="fundingPeriod" label="Funding period">
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
                    of the initial shares supply that will be offered during the
                    presale. The remainder of this supply will be minted and
                    sent to the board multisig if and when presale succeeds.
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
                    the presale goal that will be sent to the board multisig if
                    and when presale succeeds. The remainder of the contributed
                    funds will be sent to the market maker's reserve pool to
                    support trading.
                  </Help>
                </React.Fragment>
              }
              value={fields.projectFunding}
              onChange={bindUpdate('projectFunding')}
            />
          </Section>

          <Section title="Investment terms">
            <div css="display: flex">
              <InlineField label="Vesting schedule">
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
              <InlineField label="Cliff period">
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
            </div>
          </Section>

          <Section title="Trading terms">
            <div css="display: flex">
              <InlineField label="Initial price per share">
                {id => (
                  <ConfigInput
                    id={id}
                    label="DAI per share"
                    onChange={bindUpdate('initialPricePerShareInput')}
                    onChangeDone={bindUpdate('initialPricePerShare')}
                    value={fields.initialPricePerShareInput}
                    width={INPUT_MEDIUM}
                  />
                )}
              </InlineField>
              <InlineField
                label="Expected growth"
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
            <Field label="Batch length">
              <ConfigInput
                width={INPUT_MEDIUM}
                label={labelBatch(fields.batchLength)}
                value={fields.batchLength}
                onChange={bindUpdate('batchLength')}
              />
            </Field>
            <div css="display: flex">
              <InlineField label="DAI slippage %">
                <ConfigInput
                  label="%"
                  onChange={bindUpdate('slippageDai')}
                  value={fields.slippageDai}
                  width={INPUT_MEDIUM}
                />
              </InlineField>
              <InlineField label="ANT slippage %">
                <ConfigInput
                  label="%"
                  onChange={bindUpdate('slippageAnt')}
                  value={fields.slippageAnt}
                  width={INPUT_MEDIUM}
                />
              </InlineField>
            </div>
            <Field label="Initial monthly allocation">
              <ConfigInput
                label="DAI"
                onChange={bindUpdate('tapRate')}
                value={fields.tapRate}
                width={INPUT_MEDIUM}
              />
            </Field>
            <Field label="Initial tap floor">
              <ConfigInput
                label="DAI"
                onChange={bindUpdate('tapFloor')}
                value={fields.tapFloor}
                width={INPUT_MEDIUM}
              />
            </Field>
            <PercentageField
              label="Maximum monthly allocation increases and floor decreases %"
              value={fields.maximumMonthlyUpdates}
              onChange={bindUpdate('maximumMonthlyUpdates')}
            />
          </Section>
        </div>
      )}

      <Info
        mode={acceptableMinimumGrowth ? 'info' : 'warning'}
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <p>
          The current minimum growth is{' '}
          <strong>{minimumGrowth.toFixed(0)} times</strong> the organization's
          initial market capitalization. This value is calculated from the
          presale price, target goal, tokens offered, project funding, and
          initial price per share.
        </p>
        {!acceptableMinimumGrowth && (
          <p
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            <strong>
              Please adjust some parameters to change the expected growth (
              {fields.expectedGrowth}) to be greater than the minimum growth (
              {minimumGrowth.toFixed(0)}).
            </strong>
          </p>
        )}
      </Info>

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
          group: 'Presale campaign terms',
          fields: [
            ['targetGoal', 'DAI'],
            ['presalePrice', 'DAI', 'Presale price per share'],
            ['fundingPeriod', 'days'],
            ['tokensOffered', '%', 'Token supply offered'],
            ['projectFunding', '%'],
          ],
        },
        {
          group: 'Investment terms',
          fields: [
            ['initialPricePerShare', 'DAI', 'Initial trading price per share'],
            ['expectedGrowth', 'times'],
          ],
        },
        {
          group: 'Trading terms',
          fields: [
            ['vestingSchedule', 'days'],
            ['cliffPeriod', 'days'],
            ['batchLength', 'blocks'],
            ['slippageDai', '%'],
            ['slippageAnt', '%'],
            ['tapRate', 'DAI', 'Initial monthly allocation'],
            ['tapFloor', 'DAI'],
            ['maximumMonthlyUpdates', '%', 'Maximum monthly allocation update'],
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
