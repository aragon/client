import React, { useCallback, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  Info,
  Tabs,
  TextInput,
  textStyle,
  useTheme,
} from '@aragon/ui'
import {
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
} from '..'

const TABS = ['Overview', 'Advanced']

const DESCRIPTION_LIMIT = 250

const INPUT_SMALL = 17 * GU
const INPUT_MEDIUM = 24 * GU

const DEFAULT_VALUES = {
  cliffPeriod: 90,
  description: '',
  expectedGrowth: 10,
  fundingPeriod: 14,
  initialPricePerToken: 1,
  monthlyAllowance: 5000,
  targetGoal: 25000,
  tokensOffered: 90,
  upfrontCosts: 10000,
  vestingSchedule: 365,
  batchLength: 1,
  slippageDai: 25,
  slippageAnt: 100,
  initialMonthlyAllocationDai: 25,
  initialMonthlyAllocationAnt: 100,
  initialTapFloorsDai: 25,
  initialTapFloorsAnt: 100,
  maximumMonthlyAllocationAndFloorIncreases: 50,
}

function labelDays(value) {
  return value === 1 ? 'Day' : 'Days'
}

function def(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

function intDef(value, defaultValue = 0) {
  const intValue = parseInt(value, 10)
  return isNaN(intValue) ? defaultValue : intValue
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
  return { ...fields, vestingSchedule, cliffPeriod }
}

function updateCliffPeriod(fields, value) {
  const cliffPeriod = Math.max(-1, intDef(value, -1))
  const vestingSchedule = Math.max(-1, fields.vestingSchedule, cliffPeriod + 1)
  return { ...fields, vestingSchedule, cliffPeriod }
}

function reduceFields(fields, [field, value]) {
  const updateField = value => ({ ...fields, [field]: value })

  if (field === 'description') {
    return updateField(value)
  }

  if (
    field === 'monthlyAllowance' ||
    field === 'upfrontCosts' ||
    field === 'targetGoal' ||
    field === 'fundingPeriod'
  ) {
    return updateField(intDef(value))
  }

  if (field === 'tokensOffered') {
    return updateField(value)
  }

  if (field === 'initialPricePerToken') {
    return updateField(intDef(value))
  }

  if (field === 'expectedGrowth') {
    return updateField(intDef(value))
  }

  if (field === 'vestingSchedule') {
    return updateVestingSchedule(fields, value)
  }

  if (field === 'cliffPeriod') {
    return updateCliffPeriod(fields, value)
  }

  if (field === 'batchLength') {
    return updateField(intDef(value))
  }

  if (field === 'slippageDai') {
    return updateField(intDef(value))
  }

  if (field === 'slippageAnt') {
    return updateField(intDef(value))
  }

  if (field === 'initialMonthlyAllocationDai') {
    return updateField(intDef(value))
  }

  if (field === 'initialMonthlyAllocationAnt') {
    return updateField(intDef(value))
  }

  if (field === 'initialTapFloorsDai') {
    return updateField(intDef(value))
  }

  if (field === 'initialTapFloorsAnt') {
    return updateField(intDef(value))
  }

  if (field === 'maximumMonthlyAllocationAndFloorIncreases') {
    return updateField(intDef(value))
  }

  return fields
}

function FundraisingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const theme = useTheme()
  const [tab, setTab] = useState(0)
  const { fields, bindUpdate } = useConfigureFields(
    screenData.fundraising || {}
  )

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      // TODO: validation
      const error = null

      if (!error) {
        const screenData = {
          ...fields,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [data, next, dataKey, fields]
  )

  return (
    <form
      onSubmit={handleSubmit}
      css={`
        width: 100%;
      `}
    >
      <Header
        title="Configure template"
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
                appName="fundraising.aragonpm.eth"
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
          <Section title="Project’s pitch">
            <Field label="Description" css="position: relative">
              {({ id }) => (
                <React.Fragment>
                  <ConfigInput
                    id={id}
                    multiline
                    onChange={bindUpdate('description')}
                    value={fields.description}
                    wide
                    css={`
                      min-height: ${33 * GU}px;
                    `}
                  />
                  <div
                    css={`
                      position: absolute;
                      right: ${1 * GU}px;
                      bottom: ${1 * GU}px;
                      ${textStyle('body3')};
                      color: ${fields.description.length < DESCRIPTION_LIMIT
                        ? theme.surfaceContentSecondary
                        : theme.negative};
                    `}
                  >
                    Max: {DESCRIPTION_LIMIT} characters
                  </div>
                </React.Fragment>
              )}
            </Field>
          </Section>

          <Section title="Fundraising terms">
            <div css="display: flex">
              {[
                ['Upfront costs', 'upfrontCosts', fields.upfrontCosts],
                [
                  'Monthly allowance',
                  'monthlyAllowance',
                  fields.monthlyAllowance,
                ],
                ['Target goal', 'targetGoal', fields.targetGoal],
              ].map(([label, id, value]) => (
                <Field
                  key={id}
                  label={label}
                  css={`
                    width: calc(100% / 3);
                    & + & {
                      margin-left: ${2 * GU}px;
                    }
                  `}
                >
                  <ConfigInput
                    label="DAI"
                    onChange={bindUpdate(id)}
                    value={value}
                    wide
                  />
                </Field>
              ))}
            </div>

            <Field label="Funding period">
              {id => (
                <ConfigInput
                  id={id}
                  label={labelDays(fields.fundingPeriod)}
                  onChange={bindUpdate('fundingPeriod')}
                  value={fields.fundingPeriod}
                  width={INPUT_SMALL}
                />
              )}
            </Field>
          </Section>

          <Section title="Investment terms">
            <PercentageField
              label={<React.Fragment>Tokens offered %</React.Fragment>}
              value={fields.tokensOffered}
              onChange={bindUpdate('tokensOffered')}
            />

            <div
              css={`
                display: flex;
              `}
            >
              <Field label="Initial price per token">
                <ConfigInput
                  onChange={bindUpdate('initialPricePerToken')}
                  value={fields.initialPricePerToken}
                  width={INPUT_MEDIUM}
                />
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

          <Info
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            Initial exchange rate offered to raise the target funding goal will
            be:{' '}
            <strong>180000 Tokens offered at a rate of 9 Tokens per DAI</strong>
            .
          </Info>
        </div>
      )}

      {tab === 1 && (
        <div>
          <Section title="Trading terms">
            <div
              css={`
                display: flex;
              `}
            >
              <Field
                label="Batch length"
                css={`
                  display: flex;
                  margin-right: ${6 * GU}px;
                `}
              >
                <ConfigInput
                  width={INPUT_SMALL}
                  value={fields.batchLength}
                  onChange={bindUpdate('batchLength')}
                />
              </Field>
              <Field
                label="Slippage %"
                css={`
                  margin-left: ${2 * GU}px;
                `}
              >
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
            </div>
            <Field label="Initial monthly allocation">
              <div css="display: flex">
                <ConfigInput
                  label="DAI"
                  onChange={bindUpdate('initialMonthlyAllocationDai')}
                  value={fields.initialMonthlyAllocationDai}
                  width={INPUT_MEDIUM}
                />
                <ConfigInput
                  label="ANT"
                  onChange={bindUpdate('initialMonthlyAllocationAnt')}
                  value={fields.initialMonthlyAllocationAnt}
                  width={INPUT_MEDIUM}
                />
              </div>
            </Field>
            <Field label="Initial tap floors">
              <div css="display: flex">
                <ConfigInput
                  label="DAI"
                  onChange={bindUpdate('initialTapFloorsDai')}
                  value={fields.initialTapFloorsDai}
                  width={INPUT_MEDIUM}
                />
                <ConfigInput
                  label="ANT"
                  onChange={bindUpdate('initialTapFloorsAnt')}
                  value={fields.initialTapFloorsAnt}
                  width={INPUT_MEDIUM}
                />
              </div>
            </Field>
            <PercentageField
              label="Maximum monthly allocation and floor increases %"
              value={fields.maximumMonthlyAllocationAndFloorIncreases}
              onChange={bindUpdate('maximumMonthlyAllocationAndFloorIncreases')}
            />
          </Section>
        </div>
      )}

      <Navigation
        backEnabled
        nextEnabled
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
  ...props
}) {
  const theme = useTheme()

  const handleChange = useCallback(
    event => {
      onChange(event.target.value)
    },
    [onChange]
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
