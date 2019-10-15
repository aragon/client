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

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

const DEFAULT_SUPPORT = 0
const DEFAULT_QUORUM = 15
const DEFAULT_DURATION = MINUTE_IN_SECONDS
const DEFAULT_DISCUSSIONS = false

function validationError(duration) {
  if (duration < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the vote duration is equal to or longer than 1 minute.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'discussions') {
    return { ...fields, discussions: value }
  }
  if (field === 'duration') {
    return { ...fields, duration: value }
  }
  if (field === 'quorum') {
    return { ...fields, quorum: value }
  }
  if (field === 'support') {
    return { ...fields, support: value }
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

  const [{ support, quorum, duration, discussions }, updateField] = useReducer(
    reduceFields,
    {
      support: screenData.support || DEFAULT_SUPPORT,
      quorum: screenData.quorum || DEFAULT_QUORUM,
      duration: screenData.duration || DEFAULT_DURATION,
      discussions: screenData.discussions || DEFAULT_DISCUSSIONS,
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

  // Disabled for now until Discussions is ready to use
  // const handleDiscussionsChange = useCallback(value => {
  //   setFormError(null)
  //   updateField(['discussions', value])
  // }, [])

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
          discussions,
        }
        next(
          dataKey
            ? { ...data, [dataKey]: screenData }
            : { ...data, ...screenData }
        )
      }
    },
    [
      data,
      dataKey,
      discussions,
      duration,
      isPercentageFieldFocused,
      next,
      quorum,
      support,
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
            <Help hint="What’s the support?">
              <strong>Support</strong> is the minimum percentage of votes
              required on a dot voting option for it to be considered valid. For
              example, if "Support %" is set to 5%, then an option needs at
              least 5% of the total dot votes to be considered valid.
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
            <Help hint="What’s the minimum participation?">
              <strong>Minimum Participation</strong> is the minimum percentage
              of the total token supply that is required to participate in a dot
              vote for the proposal to be considered valid. For example, if
              "Minimum Participation %" is set to 51%, then at least 51% of the
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
            <Help hint="What’s the vote duration?">
              <strong>Vote Duration</strong> is the length of time that the vote
              will be open for participation. For example, if the Vote Duration
              is set to 24 hours, then token-holders have 24 hours to
              participate in the vote.
            </Help>
          </React.Fragment>
        }
      />
      {/* 
      // Disabled for now, as Discussions needs Forwarded Actions API (aragon.js#314) to work
      // It needs to import Checkbox after re-enabling the block
      <label
        css={`
          display: flex;
          align-items: center;
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Checkbox
          checked={discussions}
          onChange={handleDiscussionsChange}
          css={`
            margin-right: ${2 * GU}px;
          `}
        />
        Enable discussions
        <span
          css={`
            margin-left: ${1 * GU}px;
            margin-top: ${-0.375 * GU}px;
          `}
        >
          <Help hint="What’s this option?">
            <strong>Enable discussions:</strong> When enabled, each individual
            dot vote will have a built-in module for users to be able to comment
            on the vote.
          </Help>
        </span>
      </label>
      */}
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
    ['Support %', `${screenData.support}%`],
    ['Minimum participation %', `${screenData.quorum}%`],
    ['Vote duration', formatDuration(screenData.duration)],
    // Disabled for now, enforcing it to be false (it will be true by default in the future)
    // ['Discussions', screenData.discussions ? 'Enabled' : 'Disabled'],
  ]
}

DotVotingScreen.formatReviewFields = formatReviewFields
export default DotVotingScreen
