import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import {
  Field,
  GU,
  Help,
  Info,
  TextInput,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Header, PercentageField, PrevNextFooter } from '.'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

const DEFAULT_SUPPORT = 50
const DEFAULT_QUORUM = 15
const DEFAULT_DURATION = DAY_IN_SECONDS

function reduceFields(fields, [field, value]) {
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  if (field === 'quorum') {
    return {
      ...fields,
      quorum: value,
      support: Math.max(fields.support, value),
    }
  }
  if (field === 'support') {
    return {
      ...fields,
      support: value,
      quorum: Math.min(fields.quorum, value),
    }
  }
  return fields
}

function Voting({ back, data, fields, next, screenIndex, screens }) {
  const [{ support, quorum, duration }, updateField] = useReducer(
    reduceFields,
    {
      support: data.support || DEFAULT_SUPPORT,
      quorum: data.quorum || DEFAULT_QUORUM,
      duration: data.duration || DEFAULT_DURATION,
    }
  )

  const handleSupportChange = useCallback(value => {
    updateField(['support', value])
  }, [])

  const handleQuorumChange = useCallback(value => {
    updateField(['quorum', value])
  }, [])

  const handleDurationChange = useCallback(value => {
    updateField(['duration', value])
  }, [])

  const handleNext = useCallback(() => {
    next({
      ...data,
      support,
      quorum,
      duration,
    })
  }, [data, next, support, quorum, duration])

  const handleSupportRef = useCallback(ref => {
    if (ref) {
      ref.focus()
    }
  }, [])

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={`
          max-width: ${82 * GU}px;
        `}
      >
        <Header
          title="Configure template"
          subtitle="Choose your Voting settings below."
        />

        <PercentageField
          ref={handleSupportRef}
          label={
            <React.Fragment>
              Support
              <Help hint="What’s the support?">
                <strong>Support</strong> is the number for what percent of the
                tokens that participated in a vote must approve a proposal for
                that proposal to pass. For example, if “Support” is set to 51%,
                then 51% of tokens that vote on a proposal must approve the
                proposal for it to pass.
              </Help>
            </React.Fragment>
          }
          value={support}
          onChange={handleSupportChange}
        />

        <PercentageField
          label={
            <React.Fragment>
              Minimum approval %
              <Help hint="What’s the minimum approval?">
                <strong>Minimum Approval</strong> is the number for what percent
                of the total outstanding supply of tokens must approve a
                proposal for the vote to be considered valid. For example, if
                the Min. Quorum is set to 20%, then 20% of the outstanding token
                supply must vote to approve a proposal for the vote to be
                considered valid.
              </Help>
            </React.Fragment>
          }
          value={quorum}
          onChange={handleQuorumChange}
        />

        <VoteDuration
          duration={data.duration || DEFAULT_DURATION}
          onUpdate={handleDurationChange}
        />

        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          These settings will define your organization’s governance. The support
          and minimum approval thresholds are strict requirements, such that
          votes will only pass if they achieve approval percentages greater than
          these thresholds. These parameters currently{' '}
          <strong>cannot be changed</strong> after the organization is created.
        </Info>

        <PrevNextFooter
          backEnabled
          nextEnabled
          nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
          onBack={back}
          onNext={handleNext}
        />
      </div>
    </form>
  )
}

function VoteDuration({ duration = 0, onUpdate }) {
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
          vote duration
          <Help hint="What’s the vote duration?">
            <strong>Vote Duration</strong> is the length of time that the vote
            will be open for participation. For example, if the Vote Duration is
            set to 24 H, then tokenholders have 24 hours to participate in the
            vote.
          </Help>
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

export default Voting
