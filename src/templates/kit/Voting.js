import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, GU, Info, TextInput, useTheme } from '@aragon/ui'
import { Header, PercentageField, PrevNextFooter } from '.'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

function Voting({ back, data, fields, next, screenIndex, screens }) {
  const theme = useTheme()

  const [support, setSupport] = useState(data.support || 50)
  const [quorum, setQuorum] = useState(data.quorum || 15)
  const [localDuration, setLocalDuration] = useState(data.duration || 0)

  const handleSupportChange = useCallback(
    value => {
      setSupport(Math.max(value, quorum))
    },
    [quorum]
  )

  const handleQuorumChange = useCallback(
    value => {
      setQuorum(Math.min(value, support))
    },
    [support]
  )

  const handleNext = useCallback(() => {
    next({
      ...data,
      support,
      quorum,
      duration: localDuration,
    })
  }, [data, next, support, quorum, localDuration])

  return (
    <div
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
          label="Support"
          value={support}
          onChange={handleSupportChange}
        />

        <PercentageField
          label="Minimum approval %"
          value={quorum}
          onChange={handleQuorumChange}
        />

        <VoteDuration
          duration={data.duration || 0}
          onUpdate={setLocalDuration}
        />

        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          These settings will define your organization’s governance, for
          example, the support required for a vote to pass or its duration.
        </Info>

        <PrevNextFooter
          backEnabled
          nextEnabled
          nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
          onBack={back}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}

function VoteDuration({ duration = 0, onUpdate }) {
  const theme = useTheme()

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
    []
  )
  const handleHoursChange = useCallback(
    event => updateLocalUnit(event, setHours),
    []
  )
  const handleMinutesChange = useCallback(
    event => updateLocalUnit(event, setMinutes),
    []
  )

  return (
    <Field label="vote duration">
      <div css="display: flex">
        {[
          ['Days', handleDaysChange, days],
          ['Hours', handleHoursChange, hours],
          ['Minutes', handleMinutesChange, minutes],
        ].map(([label, handler, value]) => (
          <div
            key={label}
            css={`
              margin-right: ${2 * GU}px;
            `}
          >
            <TextInput
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
              css={`
                width: ${17 * GU}px;
                text-align: center;
              `}
            />
          </div>
        ))}
      </div>
    </Field>
  )
}

export default Voting
