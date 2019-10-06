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
  Help,
  Info,
  TextInput,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../../kit'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

const DEFAULT_DURATION = DAY_IN_SECONDS

const DURATION_LABEL = 'delay duration'
const DURATION_HELP_TEXT = `Delay Duration, The delay duration enforces a waiting period before an intent can be executed.`

function validationError(duration) {
  if (duration < 10 * MINUTE_IN_SECONDS) {
    return 'Please ensure the delay duration is equal to or longer than 10 minutes.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  return fields
}

function DelayScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState()

  const [{ delayDuration }, updateField] = useReducer(reduceFields, {
    delayDuration: screenData.delayDuration || DEFAULT_DURATION,
  })

  const handleDurationChange = useCallback(value => {
    setFormError(null)
    updateField(['duration', value])
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(delayDuration)
      setFormError(error)

      if (!error) {
        const screenData = {
          delayDuration,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [data, dataKey, delayDuration, next]
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
        subtitle="Choose your Delay app settings below."
      />

      <TimeConfig
        duration={delayDuration}
        onUpdate={handleDurationChange}
        label={DURATION_LABEL}
        helpText={DURATION_HELP_TEXT}
      />

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
        The delay duration enforces a waiting period before an intent can be
        executed.
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

DelayScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

DelayScreen.defaultProps = {
  dataKey: 'delay',
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
  return [['Delay duration', formatDuration(screenData.duration)]]
}

DelayScreen.formatReviewFields = formatReviewFields
export default DelayScreen
