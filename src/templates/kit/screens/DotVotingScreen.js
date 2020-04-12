import React, { useCallback, useReducer, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, Help, Info } from '@aragon/ui'
import {
  Duration,
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
} from '..'

import { formatDuration, DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../kit-utils'

const DEFAULT_SUPPORT = 0
const DEFAULT_QUORUM = 15
const DEFAULT_DURATION = DAY_IN_SECONDS

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
  if (field === 'quorum') {
    return {
      ...fields,
      support: Math.min(fields.support, value),
      // 100% quorum is not possible, but any adjustments necessary should be handled in the
      // template frontends themselves
      quorum: value,
    }
  }
  if (field === 'support') {
    return {
      ...fields,
      support: value,
      quorum: Math.max(fields.quorum, value),
    }
  }
  return fields
}

function DotVotingScreen({
  appLabel,
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState()

  const [{ support, quorum, duration }, updateField] = useReducer(
    reduceFields,
    {
      support: screenData.support || DEFAULT_SUPPORT,
      quorum: screenData.quorum || DEFAULT_QUORUM,
      duration: screenData.duration || DEFAULT_DURATION,
    }
  )

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
        }
        next(
          dataKey
            ? { ...data, [dataKey]: screenData }
            : { ...data, ...screenData }
        )
      }
    },
    [data, dataKey, duration, isPercentageFieldFocused, next, quorum, support]
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
                appName="dot-voting.aragonpm.eth"
                label={appLabel}
              />
            </span>
            settings below.
          </span>
        }
      />
      <PercentageField
        ref={handleSupportRef}
        label={
          <React.Fragment>
            Support %
            <Help hint="What is Support?">
              <strong>Support</strong> is the relative percentage of votes that
              are required to support a dot voting option for the option to be
              considered valid. For example, if "Support" is set to 5%, then an
              option needs more than 5% of the total dot votes to be considered
              valid.
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
            Minimum Participation %
            <Help hint="What is Minimum Participation?">
              <strong>Minimum Participation</strong> is the minimum percentage
              of the total token supply that is required to participate in a dot
              vote for the proposal to be considered valid. For example, if
              "Minimum Participation" is set to 50%, then more than 50% of the
              outstanding token supply must have participated in the vote for
              the vote to be considered valid.
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
              is set to 24 hours, then token-holders have 24 hours to
              participate in the vote.
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
        The support and minimum participation thresholds are strict
        requirements, such that dot votes will only pass if they achieve
        participation percentages greater than these thresholds.
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

DotVotingScreen.propTypes = {
  appLabel: PropTypes.string,
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

DotVotingScreen.defaultProps = {
  appLabel: 'Dot Voting',
  dataKey: 'dotVoting',
}

function formatReviewFields(screenData) {
  return [
    ['Support %', `${screenData.support}%`],
    ['Minimum participation %', `${screenData.quorum}%`],
    ['Vote duration', formatDuration(screenData.duration)],
  ]
}

DotVotingScreen.formatReviewFields = formatReviewFields
export default DotVotingScreen
