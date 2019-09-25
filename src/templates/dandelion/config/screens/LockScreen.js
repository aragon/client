import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  theme,
  Help,
  Info,
  Button,
  TextInput,
  useTheme,
  useViewport,
  IconTrash,
} from '@aragon/ui'
import {
  Header,
  Navigation,
  ScreenPropsType,
  PercentageField,
} from '../../../kit'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24
const SPAM_PENALTY_DEFAULT = 50

const DEFAULT_DURATION = DAY_IN_SECONDS

const DURATION_LABEL = 'lock duration'
const DURATION_HELP_TEXT = `Lock Duration, The lock duration is the period of time that the tokens will be locked. `

function useFieldsLayout() {
  // In its own hook to be adapted for smaller views
  return `
    display: grid;
    grid-template-columns: auto ${12 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}

function validationError(duration) {
  if (duration < 10 * MINUTE_IN_SECONDS) {
    return 'Please ensure the lock duration is equal to or longer than 10 minutes.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  if (field === 'tokenAddress') {
    return { ...fields, tokenAddress: value }
  }
  if (field === 'lockAmount') {
    return { ...fields, lockAmount: value }
  }
  if (field === 'spamPenalty') {
    return { ...fields, spamPenalty: value }
  }
  return fields
}

function LockScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const fieldsLayout = useFieldsLayout()

  const [formError, setFormError] = useState()
  // const [tokenAddress, setTokenAddress] = useState()

  const [
    { duration, tokenAddress, lockAmount, spamPenalty },
    updateField,
  ] = useReducer(reduceFields, {
    duration: screenData.duration || DEFAULT_DURATION,
    tokenAddress: screenData.tokenAddress || '',
    lockAmount: screenData.lockAmount || '',
    spamPenalty: screenData.spamPenalty || SPAM_PENALTY_DEFAULT,
  })

  const handleDurationChange = useCallback(value => {
    setFormError(null)
    updateField(['duration', value])
  }, [])

  const handleTokenAddressChange = useCallback(event => {
    setFormError(null)
    updateField(['tokenAddress', event.target.value])
  }, [])

  const handleSpamPenaltyChange = useCallback(value => {
    setFormError(null)
    updateField(['spamPenalty', value])
  }, [])

  const handleLockAmountChange = useCallback(event => {
    setFormError(null)
    updateField(['lockAmount', event.target.value])
  }, [])

  const handleClearTokenAddress = useCallback(() => {
    setFormError(null)
    updateField(['tokenAddress', ''])
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(duration)
      setFormError(error)

      if (!error) {
        const screenData = {
          duration,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [data, dataKey, duration, tokenAddress, lockAmount, next]
  )

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <Header
        title="Configure template"
        subtitle="Choose your time lock app settings below."
      />

      <div
        css={`
          ${fieldsLayout};
        `}
      >
        <Field
          label={
            <React.Fragment>
              Token address
              <Help hint="What’s the token address?">
                <strong>Token address</strong> is the address of the token to be
                locked.
              </Help>
            </React.Fragment>
          }
        >
          <TextInput
            adornment={
              <span css="transform: translateY(1px)">
                <Button
                  display="icon"
                  icon={
                    <IconTrash
                      css={`
                        color: ${theme.negative};
                      `}
                    />
                  }
                  label="Remove"
                  onClick={handleClearTokenAddress}
                  size="mini"
                />
              </span>
            }
            adornmentPosition="end"
            adornmentSettings={{ width: 52, padding: 8 }}
            onChange={handleTokenAddressChange}
            placeholder="Ethereum token address"
            value={tokenAddress}
            wide
            css={`
              padding-left: ${1 * GU}px;
            `}
          />
        </Field>

        <Field
          label={
            <React.Fragment>
              Lock amount
              <Help hint="What’s the lock amount?">
                <strong>Lock amount</strong> is the amount of tokens to lock.
              </Help>
            </React.Fragment>
          }
        >
          <TextInput
            onChange={handleLockAmountChange}
            value={lockAmount}
            wide
          />
        </Field>
      </div>

      <PercentageField
        label={
          <React.Fragment>
            Spam penalty %
            <Help hint="What’s the spam penalty?">
              <strong>Spam penalty</strong>
            </Help>
          </React.Fragment>
        }
        value={spamPenalty}
        onChange={handleSpamPenaltyChange}
      />

      <TimeConfig
        duration={duration}
        onUpdate={handleDurationChange}
        label={DURATION_LABEL}
        helpText={DURATION_HELP_TEXT}
      />

      {/* <PercentageField
        ref={handleSupportRef}
        label={
          <React.Fragment>
            Spam penalty
            <Help hint="What’s the support?">
              <strong>Support</strong> is the percentage of votes on a proposal
              that the total support must be greater than for the proposal to be
              approved. For example, if “Support” is set to 51%, then more than
              51% of the votes on a proposal must vote “Yes” for the proposal to
              pass.
            </Help>
          </React.Fragment>
        }
        value={support}
        onChange={handleSupportChange}
      /> */}

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

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings will determine the token to be locked, how long tokens
        are locked, the amount of tokens to lock and a penalty percentage for
        spamming proposals. At initialization the token address parameter can be
        set to an ERC20 token. It cannot be changed. If a change is necessary
        the user can install a new instance and change permissions in the
        organization to reflect the change.
      </Info>

      <Navigation
        ref={prevNextRef}
        backEnabled
        nextEnabled
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

LockScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

LockScreen.defaultProps = {
  dataKey: 'lock',
}

function TimeConfig({ duration = 0, onUpdate, label, helpText }) {
  const theme = useTheme()
  const { above } = useViewport()

  // Calculate the units based on the initial duration (in seconds).
  const [baseDays, baseHours, baseMinutes] = useMemo(() => {
    let remaining = duration

    const days = Math.floor(remaining / DAY_IN_SECONDS)
    remaining -= days * DAY_IN_SECONDS

    const hours = Math.floor(remaining / HOUR_IN_SECONDS)
    remaining -= hours * HOUR_IN_SECONDS

    const minutes = Math.floor(remaining / MINUTE_IN_SECONDS)
    remaining -= minutes * MINUTE_IN_SECONDS

    return [days, hours, minutes]
  }, [duration])

  // Local units state − updated from the initial duration if needed.
  const [minutes, setMinutes] = useState(baseMinutes)
  const [hours, setHours] = useState(baseHours)
  const [days, setDays] = useState(baseDays)

  // If any of the units change, call onUpdate() with the updated duration,
  // so that it can get updated if the “next” button gets pressed.
  useEffect(() => {
    onUpdate(
      minutes * MINUTE_IN_SECONDS +
        hours * HOUR_IN_SECONDS +
        days * DAY_IN_SECONDS
    )
  }, [onUpdate, minutes, hours, days])

  // Invoked by handleDaysChange etc. to update a local unit.
  const updateLocalUnit = useCallback((event, stateSetter) => {
    const value = Number(event.target.value)
    if (!isNaN(value)) {
      stateSetter(value)
    }
  }, [])

  const handleDaysChange = useCallback(
    event => updateLocalUnit(event, setDays),
    [updateLocalUnit]
  )
  const handleHoursChange = useCallback(
    event => updateLocalUnit(event, setHours),
    [updateLocalUnit]
  )
  const handleMinutesChange = useCallback(
    event => updateLocalUnit(event, setMinutes),
    [updateLocalUnit]
  )

  return (
    <Field
      label={
        <React.Fragment>
          {label}
          <Help hint="What’s the vote duration?">{helpText}</Help>
        </React.Fragment>
      }
    >
      {({ id }) => (
        <div
          css={`
            display: flex;
            padding-top: ${0.5 * GU}px;
            width: 100%;
          `}
        >
          {[
            ['Days', handleDaysChange, days],
            ['Hours', handleHoursChange, hours],
            [
              above('medium') ? 'Minutes' : 'Min.',
              handleMinutesChange,
              minutes,
            ],
          ].map(([label, handler, value], index) => (
            <div
              key={label}
              css={`
                flex-grow: 1;
                max-width: ${17 * GU}px;
                & + & {
                  margin-left: ${2 * GU}px;
                }
              `}
            >
              <TextInput
                id={index === 0 ? id : undefined}
                adornment={
                  <span
                    css={`
                      padding: 0 ${2 * GU}px;
                      color: ${theme.contentSecondary};
                    `}
                  >
                    {label}
                  </span>
                }
                adornmentPosition="end"
                adornmentSettings={{
                  width: 8 * GU,
                  padding: 0,
                }}
                onChange={handler}
                value={value}
                wide
                css="text-align: center"
              />
            </div>
          ))}
        </div>
      )}
    </Field>
  )
}

TimeConfig.propTypes = {
  duration: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
}

TimeConfig.defaultProps = {
  duration: 0,
}

function formatDuration(duration) {
  const units = [DAY_IN_SECONDS, HOUR_IN_SECONDS, MINUTE_IN_SECONDS]

  // Convert in independent unit values
  const [days, hours, minutes] = units.reduce(
    ([unitValues, duration], unitInSeconds) => [
      [...unitValues, Math.floor(duration / unitInSeconds)],
      duration % unitInSeconds,
    ],
    [[], duration]
  )[0]

  // Format
  return [
    [days, 'day', 'days'],
    [hours, 'hour', 'hours'],
    [minutes, 'minute', 'minutes'],
  ]
    .filter(([value]) => value > 0)
    .reduce(
      (str, [value, unitSingular, unitPlural], index, values) =>
        str +
        (index > 0 && index < values.length - 1 ? ', ' : '') +
        (values.length > 1 && index === values.length - 1 ? ' and ' : '') +
        `${value} ${value === 1 ? unitSingular : unitPlural}`,
      ''
    )
}

function formatReviewFields(screenData) {
  return [['Lock duration', formatDuration(screenData.duration)]]
}

LockScreen.formatReviewFields = formatReviewFields
export default LockScreen
