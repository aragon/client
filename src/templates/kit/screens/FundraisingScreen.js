import React, { useCallback, useMemo, useReducer, useState } from 'react'
import { Decimal } from 'decimal.js'
import PropTypes from 'prop-types'
import { Field, GU, Help, Info, Tabs, TextInput, useTheme } from '@aragon/ui'
import {
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
} from '..'

const TABS = ['Overview', 'Advanced']
const INPUT_SMALL = 17 * GU
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

function FundraisingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [tab, setTab] = useState(0)
  const { fields, bindUpdate } = useConfigureFields(screenData || {})

  const minimumGrowth = useMemo(() => updateMinimumGrowth(fields), [fields])

  const nextEnabled = useMemo(() => {
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

      next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
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
            <Field key="targetGoal" label="Target Goal">
              <ConfigInput
                label="DAI"
                onChange={bindUpdate('targetGoal')}
                value={fields.targetGoal}
              />
            </Field>
            <Field key="presalePrice" label="Price">
              <ConfigInput
                label="DAI per share"
                onChange={bindUpdate('presalePriceInput')}
                onChangeDone={bindUpdate('presalePrice')}
                value={fields.presalePriceInput}
              />
            </Field>
            <Field key="fundingPeriod" label="Funding period">
              <ConfigInput
                label={labelDays(fields.fundingPeriod)}
                onChange={bindUpdate('fundingPeriod')}
                value={fields.fundingPeriod === -1 ? '' : fields.fundingPeriod}
              />
            </Field>
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
            <Field label="Vesting schedule">
              {id => (
                <ConfigInput
                  id={id}
                  label={labelDays(fields.vestingSchedule)}
                  onChange={bindUpdate('vestingSchedule')}
                  value={
                    fields.vestingSchedule === -1 ? '' : fields.vestingSchedule
                  }
                  width={INPUT_SMALL}
                />
              )}
            </Field>
            <Field label="Cliff period">
              {id => (
                <ConfigInput
                  id={id}
                  label={labelDays(fields.cliffPeriod)}
                  onChange={bindUpdate('cliffPeriod')}
                  value={fields.cliffPeriod === -1 ? '' : fields.cliffPeriod}
                  width={INPUT_SMALL}
                />
              )}
            </Field>
          </Section>

          <Section title="Trading terms">
            <div css="display: flex;">
              <Field label="Initial price per share">
                {id => (
                  <ConfigInput
                    id={id}
                    onChange={bindUpdate('initialPricePerShareInput')}
                    onChangeDone={bindUpdate('initialPricePerShare')}
                    value={fields.initialPricePerShareInput}
                    width={INPUT_MEDIUM}
                  />
                )}
              </Field>
              <Field
                label="Expected growth"
                css={`
                  flex-grow: 1;
                  margin-left: ${2 * GU}px;
                `}
              >
                <ConfigInput
                  label="Times Initial Market Cap"
                  onChange={bindUpdate('expectedGrowth')}
                  value={fields.expectedGrowth}
                  wide
                />
              </Field>
            </div>
          </Section>
        </div>
      )}

      {tab === 1 && (
        <div>
          <Section title="Trading terms">
            <Field label="Batch length">
              <ConfigInput
                width={INPUT_SMALL}
                label={labelBatch(fields.batchLength)}
                value={fields.batchLength}
                onChange={bindUpdate('batchLength')}
              />
            </Field>
            <Field label="Slippage %">
              <div css="display: flex">
                <ConfigInput
                  label="DAI"
                  onChange={bindUpdate('slippageDai')}
                  value={fields.slippageDai}
                  width={INPUT_SMALL}
                />
                <ConfigInput
                  label="ANT"
                  onChange={bindUpdate('slippageAnt')}
                  value={fields.slippageAnt}
                  width={INPUT_SMALL}
                />
              </div>
            </Field>
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
        mode={minimumGrowth.gte(fields.expectedGrowth) ? 'warning' : 'info'}
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <p>
          The current minimum growth is {minimumGrowth.toFixed(0)}. This value
          is calculated from the presale price, target goal, tokens offered,
          project funding, and initial price per share.
        </p>
        {minimumGrowth.gte(fields.expectedGrowth) && (
          <p
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            <strong>
              Please make sure that the expected growth ({fields.expectedGrowth}
              ) is greater than the minimum growth.
            </strong>
          </p>
        )}
      </Info>

      <Navigation
        backEnabled
        nextEnabled={nextEnabled}
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
  return (
    <section>
      <h1
        css={`
          margin: ${4 * GU}px 0 ${3 * GU}px;
        `}
      >
        {title}
      </h1>
      <div>{children}</div>
    </section>
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

/* eslint-enable react/prop-types */

// TODO: proper formatting
function formatReviewFields(screenData) {
  return Object.entries(screenData).map(([name, value]) => [
    name.replace(/([A-Z])/g, ' $1'),
    value === '' ? 'None' : value,
  ])
}

FundraisingScreen.formatReviewFields = formatReviewFields
export default FundraisingScreen
