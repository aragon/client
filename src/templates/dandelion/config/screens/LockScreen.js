import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Field, GU, Help, Info, TextInput, isAddress } from '@aragon/ui'
import {
  Header,
  Navigation,
  ScreenPropsType,
  Duration,
  KnownAppBadge,
} from '../../../kit'
import TokenSelector from '../../components/TokenSelector/TokenSelector'
import { getDefaultLockTokenByNetwork } from '../helpers/tokens'
import { shortenAddress } from '../../../../web3-utils'
import {
  formatDuration,
  DAY_IN_SECONDS,
  MINUTE_IN_SECONDS,
} from '../../../kit/kit-utils'

const DEFAULT_SPAM_PENALTY = 50
const DEFAULT_DURATION = DAY_IN_SECONDS
const DEFAULT_LOCK_TOKEN = getDefaultLockTokenByNetwork()
const EMPTY_TOKEN = { data: { address: '' }, selectedIndex: -1 }

function validationError(lockAmount, lockDuration, lockToken) {
  if (!lockToken || !isAddress(lockToken)) {
    return 'You need at least one valid address.'
  }
  if (lockAmount <= 0) {
    return 'You need to set a positive lock amount.'
  }
  if (lockDuration < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the lock duration is equal to or longer than 1 minute.'
  }
  return null
}

function LockScreen({
  appLabel,
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
  title,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}

  const [formError, setFormError] = useState(null)

  const [
    { lockAmount, lockDuration, lockToken, spamPenalty },
    updateField,
  ] = useState({
    lockAmount: screenData.lockAmount || -1,
    lockDuration: screenData.lockDuration || DEFAULT_DURATION,
    lockToken: screenData.lockToken || EMPTY_TOKEN,
    spamPenalty: screenData.spamPenalty || DEFAULT_SPAM_PENALTY,
  })

  const handleLockAmountChange = useCallback(event => {
    setFormError(null)

    const value = parseInt(event.target.value, 10)
    updateField(settings => ({
      ...settings,
      lockAmount: isNaN(value) ? -1 : value,
    }))
  }, [])

  const handleLockDurationChange = useCallback(value => {
    setFormError(null)
    updateField(settings => ({
      ...settings,
      lockDuration: value,
    }))
  }, [])

  const handleLockTokenChange = useCallback(({ token, selectedIndex }) => {
    setFormError(null)
    updateField(settings => ({
      ...settings,
      lockToken: { data: token, selectedIndex },
    }))
  }, [])

  const handleSpamPenaltyChange = useCallback(event => {
    setFormError(null)

    const spamPenalty = event.target.value
    updateField(settings => ({
      ...settings,
      spamPenalty,
    }))
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(
        lockAmount,
        lockDuration,
        lockToken.data.address
      )
      setFormError(error)

      if (!error) {
        const screenData = {
          lockAmount,
          lockDuration,
          lockToken,
          spamPenalty,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [lockAmount, lockDuration, lockToken, spamPenalty, next, dataKey, data]
  )

  const disableNext = lockAmount < 0 || !lockToken.data.address

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <Header
        title={title}
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
                appName="time-lock.aragonpm.eth"
                label={appLabel}
              />
            </span>
            settings below.
          </span>
        }
      />

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        The Time Lock app is used to discourage spammy, low-quality proposal
        submission by requiring users to lock tokens for a period of time
        whenever they submit a proposal. The amount and duration of each lock
        increases the more simultaneously active locks the user has accrued.
      </Info>

      <div
        css={`
          display: grid;
          grid-template-columns: auto ${12 * GU}px;
          grid-column-gap: ${1.5 * GU}px;
        `}
      >
        <Field
          label={
            <React.Fragment>
              Token to lock
              <Help hint="What’s the token to lock?">
                <strong>Token to lock</strong> is the address of the token to be
                locked. This value cannot be easily modified, so pick wisely!
              </Help>
            </React.Fragment>
          }
        >
          <TokenSelector
            selectedIndex={lockToken.selectedIndex}
            onChange={handleLockTokenChange}
            value={lockToken.data.address}
            tokens={[DEFAULT_LOCK_TOKEN]}
          />
        </Field>

        <Field
          label={
            <React.Fragment>
              Lock amount
              <Help hint="What’s the lock amount?">
                <strong>Lock amount</strong> is the amount of tokens a user will
                need to lock in order to perform an action that has been
                protected by the Time Lock app.
              </Help>
            </React.Fragment>
          }
        >
          <TextInput
            onChange={handleLockAmountChange}
            value={lockAmount === -1 ? '' : lockAmount}
            wide
          />
        </Field>
        <div>
          <Duration
            duration={lockDuration}
            onUpdate={handleLockDurationChange}
            label={
              <React.Fragment>
                Lock duration
                <Help hint="What’s the lock duration?">
                  <strong>Lock Duration</strong> is the period of time that the
                  tokens will be locked.
                </Help>
              </React.Fragment>
            }
          />

          <Field
            label={
              <React.Fragment>
                Spam penalty %
                <Help hint="What’s the spam penalty?">
                  For each additional active lock a user creates, the required
                  amount of tokens and duration of the next lock will be
                  increased by this percentage of the base amount and duration.
                </Help>
              </React.Fragment>
            }
          >
            <TextInput
              type="number"
              step={1}
              onChange={handleSpamPenaltyChange}
              value={spamPenalty}
              css={`
                width: 136px;
              `}
            />
            <span> %</span>
          </Field>
        </div>
      </div>

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
        ref={prevNextRef}
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

LockScreen.propTypes = {
  appLabel: PropTypes.string,
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

LockScreen.defaultProps = {
  appLabel: 'Time Lock',
  dataKey: 'lock',
  title: 'Configure template',
}

function formatReviewFields(screenData) {
  const { lockToken, lockAmount, lockDuration, spamPenalty } = screenData
  return [
    [
      'Token',
      `${lockToken.data.symbol} (${lockToken.data.name} ${shortenAddress(
        lockToken.data.address
      )})`,
    ],
    ['Lock amount', `${lockAmount} ${lockAmount === 1 ? 'token' : 'tokens'}`],
    ['Lock duration', formatDuration(lockDuration)],
    ['Spam penalty', `${spamPenalty} %`],
  ]
}

LockScreen.formatReviewFields = formatReviewFields
export default LockScreen
