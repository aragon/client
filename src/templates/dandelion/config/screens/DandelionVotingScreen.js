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
import {
  formatDuration,
  DAY_IN_SECONDS,
  HOUR_IN_SECONDS,
  MINUTE_IN_SECONDS,
} from '../../../kit/kit-utils'

const DEFAULT_SUPPORT = 50
const DEFAULT_QUORUM = 1
const DEFAULT_DURATION = DAY_IN_SECONDS
const DEFAULT_BUFFER = HOUR_IN_SECONDS
const DEFAULT_DELAY = DAY_IN_SECONDS

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

function DandelionVotingScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState(null)

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
            <Help hint="What is Support?">
              <strong>Support</strong> is the relative percentage of tokens that
              are required to vote “Yes” for a proposal to be approved. For
              example, if “Support” is set to 50%, then more than 50% of the
              tokens used to vote on a proposal must vote “Yes” for it to pass.
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
            <Help hint="What is Minimum Approval?">
              <strong>Minimum Approval</strong> is the percentage of the total
              token supply that is required to vote “Yes” on a proposal before
              it can be approved. For example, if the “Minimum Approval” is set
              to 20%, then more than 20% of the outstanding token supply must
              vote “Yes” on a proposal for it to pass.
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
            Vote duration
            <Help hint="What is Vote Duration?">
              <strong>Vote Duration</strong> is the length of time that the vote
              will be open for participation. For example, if the Vote Duration
              is set to 24 hours, then tokenholders have 24 hours to participate
              in the vote.`
            </Help>
          </React.Fragment>
        }
      />
      <Duration
        duration={buffer}
        onUpdate={handleBufferChange}
        label={
          <React.Fragment>
            Vote buffer
            <Help hint="What is Vote Buffer?">
              <strong>Vote Buffer</strong> is the minimum amount of time
              separating the start time of each new vote, as votes are processed
              in the sequence they were created.
            </Help>
          </React.Fragment>
        }
      />
      <Duration
        duration={delay}
        onUpdate={handleDelayChange}
        label={
          <React.Fragment>
            Vote delay
            <Help hint="What is Vote Delay?">
              <strong>Vote Delay</strong> is the period of time an approved vote
              must wait before being executed.
            </Help>
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

DandelionVotingScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

DandelionVotingScreen.defaultProps = {
  appLabel: 'Voting',
  dataKey: 'voting',
  title: 'Configure template',
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

DandelionVotingScreen.formatReviewFields = formatReviewFields
export default DandelionVotingScreen
