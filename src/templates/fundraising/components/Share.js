import React, { useCallback, useReducer, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  Help,
  Info,
  TextInput,
  textStyle,
  useTheme,
} from '@aragon/ui'
import {
  Duration,
  Header,
  KnownAppBadge,
  Navigation,
  PercentageField,
  ScreenPropsType,
} from '../../kit'

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
      // 100% quorum is not possible, but any adjustments necessary should be handled in the
      // template frontends themselves
      quorum: value,
      support: Math.max(fields.support, value),
    }
  }
  if (field === 'support') {
    return {
      ...fields,
      // 100% support is not possible, but any adjustments necessary should be handled in the
      // template frontends themselves
      support: value,
      quorum: Math.min(fields.quorum, value),
    }
  }
  return fields
}

function useFieldsLayout() {
  // In its own hook to be adapted for smaller views
  return `
    display: grid;
    grid-template-columns: auto ${12 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}

function validationError(tokenName, tokenSymbol, duration) {
  if (!tokenName.trim()) {
    return 'Please add a token name.'
  }
  if (!tokenSymbol) {
    return 'Please add a token symbol.'
  }
  if (duration < 10 * MINUTE_IN_SECONDS) {
    return 'Please ensure the vote duration is equal to or longer than 10 minutes.'
  }
  return null
}

function Share({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
  title,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const fieldsLayout = useFieldsLayout()

  const [formError, setFormError] = useState()
  const [tokenName, setTokenName] = useState(screenData.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(screenData.tokenSymbol || '')
  const [{ support, quorum, duration }, updateField] = useReducer(
    reduceFields,
    {
      support: screenData.support || DEFAULT_SUPPORT,
      quorum: screenData.quorum || DEFAULT_QUORUM,
      duration: screenData.duration || DEFAULT_DURATION,
    }
  )

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

  // Focus the token name as soon as it becomes available
  const handleTokenNameRef = useCallback(element => {
    if (element) {
      element.focus()
    }
  }, [])

  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const disableNext = !tokenName || !tokenSymbol

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

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(tokenName, tokenSymbol, duration)
      setFormError(error)

      // If one of the percentage fields is focused when the form is submitted,
      // move the focus on the next button instead.
      if (isPercentageFieldFocused() && prevNextRef.current) {
        prevNextRef.current.focusNext()
        return
      }

      if (!error) {
        const screenData = {
          tokenName,
          tokenSymbol,
          support: Math.floor(support),
          quorum: Math.floor(quorum),
          duration,
        }
        const mergedData = dataKey
          ? { ...data, [dataKey]: screenData }
          : { ...data, ...screenData }

        next(mergedData)
      }
    },
    [
      data,
      dataKey,
      next,
      tokenName,
      tokenSymbol,
      support,
      quorum,
      duration,
      isPercentageFieldFocused,
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
      <Header title={title} />
      <Subtitle
        content={
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: flex-start;
              margin-bottom
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
                appName="token-manager.aragonpm.eth"
                label="Token: shareholders"
              />
            </span>
            settings
          </span>
        }
      />
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings configure the token that will represent your
        organization's shareholders. This is the token that will be traded
        through your fundraising campaign.
      </Info>
      <div
        css={`
          ${fieldsLayout};
        `}
      >
        <Field
          label={
            <React.Fragment>
              Share token name
              <Help hint="What’s the share token name?">
                <strong>Share token name</strong> will be the name assigned to
                the token representing your organization's shareholders.{' '}
                <em>For example: My Share Token.</em>
              </Help>
            </React.Fragment>
          }
        >
          {({ id }) => (
            <TextInput
              ref={handleTokenNameRef}
              id={id}
              onChange={handleTokenNameChange}
              placeholder="My Share Token"
              value={tokenName}
              wide
            />
          )}
        </Field>

        <Field
          label={
            <React.Fragment>
              Share token symbol
              <Help hint="What’s share token symbol?">
                <strong>Share token symbol</strong> will be the shortened name
                (typically in capital letters) assigned to the token
                representing your organization's shareholders.{' '}
                <em>For example: SHR.</em>
              </Help>
            </React.Fragment>
          }
        >
          {({ id }) => (
            <TextInput
              id={id}
              onChange={handleTokenSymbolChange}
              value={tokenSymbol}
              placeholder="SHR"
              wide
            />
          )}
        </Field>
      </div>

      <Subtitle
        content={
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: flex-start;
              margin-bottom
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
                appName="voting.aragonpm.eth"
                label="Voting: shareholders"
              />
            </span>
            settings
          </span>
        }
      />

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <p>
          These settings affect the decision making process for shareholders.
        </p>
        <p css={`margin-top: {1 * GU}px`}>
          The support and minimum approval thresholds are strict requirements,
          such that votes will only pass if they achieve approval percentages
          greater than these thresholds.
        </p>
      </Info>

      <PercentageField
        ref={handleSupportRef}
        label={
          <React.Fragment>
            Support %
            <Help hint="What’s the support?">
              <strong>Support</strong> is the relative percentage of
              shareholders' tokens that are required to vote “Yes” for a
              proposal to be approved. For example, if “Support” is set to 51%,
              then more than 51% of the tokens used to vote on a proposal must
              be “Yes” for it to pass.
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
              <strong>Minimum Approval</strong> is the percentage of the total{' '}
              {tokenSymbol} supply that is required to vote “Yes” on a proposal
              before it can be approved. For example, if the “Minimum Approval”
              is set to 20%, then more than 20% of the outstanding {tokenSymbol}{' '}
              supply must vote “Yes” on a proposal for it to pass.
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
              <strong>Vote Duration</strong> is the length of time that
              shareholders' votes will be open for participation. For example,
              if the Vote Duration is set to 24 hours, then shareholders will
              have 24 hours to participate in the vote.
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

      <Navigation
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

function Subtitle({ content }) {
  const theme = useTheme()

  return (
    <h4
      css={`
        ${textStyle('title4')};
        color: ${theme.contentSecondary};
        margin-bottom: ${3 * GU}px;
      `}
    >
      {content}
    </h4>
  )
}

Subtitle.propTypes = {
  content: PropTypes.any,
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
    [
      'Token name & symbol',
      `${screenData.tokenName} (${screenData.tokenSymbol})`,
    ],
    ['Support %', `${screenData.support}%`],
    ['Minimum approval %', `${screenData.quorum}%`],
    ['Vote duration', formatDuration(screenData.duration)],
  ]
}

Share.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

Share.defaultProps = {
  dataKey: 'share',
  title: 'Configure template',
}

Share.formatReviewFields = formatReviewFields

export default Share
