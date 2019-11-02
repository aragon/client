import React, { useCallback, useReducer, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, Help, Info } from '@aragon/ui'
import {
  Header,
  PercentageField,
  Navigation,
  ScreenPropsType,
  Duration,
} from '../../../kit'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

const DEFAULT_SUPPORT = 50
const DEFAULT_QUORUM = 15
const DEFAULT_DURATION = DAY_IN_SECONDS
const DEFAULT_BUFFER = DAY_IN_SECONDS
const DEFAULT_DELAY = HOUR_IN_SECONDS

const DURATION_LABEL = 'Vote duration'
const DURATION_HELP_TEXT = `Vote Duration is the length of time that the vote
will be open for participation. For example, if the Vote Duration is
set to 24 hours, then tokenholders have 24 hours to participate in
the vote.`

const BUFFER_LABEL = 'Vote buffer'
const BUFFER_HELP_TEXT = `Votes are processed in sequence with the start time of each proposal seperated by a proposal buffer`

const DELAY_LABEL = 'Vote delay'
const DELAY_HELP_TEXT =
  'Vote Delay is the delay period after a vote is approved but before it can be executed'

function validationError(duration) {
  if (duration < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the vote duration is equal to or longer than 1 minute.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  if (field === 'buffer') {
    return { ...fields, buffer: value }
  }
  if (field === 'delay') {
    return { ...fields, delay: value }
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

function VotingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState()

  const [
    { support, quorum, duration, buffer, delay },
    updateField,
  ] = useReducer(reduceFields, {
    support: screenData.support || DEFAULT_SUPPORT,
    quorum: screenData.quorum || DEFAULT_QUORUM,
    duration: screenData.duration || DEFAULT_DURATION,
    buffer: screenData.buffer || DEFAULT_BUFFER,
    delay: screenData.delay || DEFAULT_DELAY,
  })

  const handleSupportChange = useCallback(value => {
    setFormError(null)
    updateField(['support', value])
  }, [])

  const handleQuorumChange = useCallback(value => {
    setFormError(null)
    updateField(['quorum', value])
  }, [])

  const handleDurationChange = useCallback(value => {
    setFormError(null)
    updateField(['duration', value])
  }, [])

  const handleBufferChange = useCallback(value => {
    setFormError(null)
    updateField(['buffer', value])
  }, [])

  const handleDelayChange = useCallback(value => {
    setFormError(null)
    updateField(['delay', value])
  }, [])

  const supportRef = useRef()
  const quorumRef = useRef()

  const handleSupportRef = useCallback(ref => {
    supportRef.current = ref
    if (ref) {
      ref.focus()
    }
  }, [])

  const isPercentageFieldFocused = useCallback(() => {
    return (
      (supportRef.current &&
        supportRef.current.element === document.activeElement) ||
      (quorumRef.current &&
        quorumRef.current.element === document.activeElement)
    )
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(duration)
      setFormError(error)

      // If one of the percentage fields is focused when the form is submitted,
      // move the focus on the next button instead.
      if (isPercentageFieldFocused() && prevNextRef.current) {
        prevNextRef.current.focusNext()
        return
      }

      if (!error) {
        const screenData = {
          support: Math.floor(support),
          quorum: Math.floor(quorum),
          duration,
          buffer,
          delay,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [
      duration,
      isPercentageFieldFocused,
      support,
      quorum,
      buffer,
      delay,
      next,
      dataKey,
      data,
    ]
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
        subtitle="Choose your Voting app settings below."
      />

      <PercentageField
        ref={handleSupportRef}
        label={
          <React.Fragment>
            Support %
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
      />

      <PercentageField
        ref={quorumRef}
        label={
          <React.Fragment>
            Minimum approval %
            <Help hint="What’s the minimum approval?">
              <strong>Minimum Approval</strong> is the percentage of the total
              token supply that support for a proposal must be greater than for
              the proposal to be considered valid. For example, if the “Minimum
              Approval” is set to 20%, then more than 20% of the outstanding
              token supply must vote to approve a proposal for the vote to be
              considered valid.
            </Help>
          </React.Fragment>
        }
        value={quorum}
        onChange={handleQuorumChange}
      />

      <Duration
        duration={duration}
        onUpdate={handleDurationChange}
        label={
          <React.Fragment>
            {DURATION_LABEL}
            <Help hint="What’s the vote duration?">{DURATION_HELP_TEXT}</Help>
          </React.Fragment>
        }
      />
      <Duration
        duration={buffer}
        onUpdate={handleBufferChange}
        label={
          <React.Fragment>
            {BUFFER_LABEL}
            <Help hint="What’s the vote buffer?">{BUFFER_HELP_TEXT}</Help>
          </React.Fragment>
        }
      />
      <Duration
        duration={delay}
        onUpdate={handleDelayChange}
        label={
          <React.Fragment>
            {DELAY_LABEL}
            <Help hint="What’s the vote delay?">{DELAY_HELP_TEXT}</Help>
          </React.Fragment>
        }
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
        The support and minimum approval thresholds are strict requirements,
        such that votes will only pass if they achieve approval percentages
        greater than these thresholds.
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

VotingScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

VotingScreen.defaultProps = {
  appLabel: 'Voting',
  dataKey: 'voting',
  title: 'Configure template',
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
  return [
    ['Support', `${screenData.support}%`],
    ['Minimum approval %', `${screenData.quorum}%`],
    ['Vote duration', formatDuration(screenData.duration)],
    ['Vote buffer', formatDuration(screenData.buffer)],
    ['Vote delay', formatDuration(screenData.delay)],
  ]
}

VotingScreen.formatReviewFields = formatReviewFields
export default VotingScreen
