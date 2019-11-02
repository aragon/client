import React, { useCallback, useReducer, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  GU,
  theme,
  Help,
  Info,
  Button,
  TextInput,
  IconTrash,
  isAddress,
} from '@aragon/ui'
import {
  Header,
  Navigation,
  ScreenPropsType,
  PercentageField,
  Duration,
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

function validationError(duration, tokenAddress, lockAmount) {
  if (!tokenAddress || !isAddress(tokenAddress)) {
    return 'You need at least one valid address.'
  }
  if (!lockAmount > 0) {
    return 'You need to set a positive lock amount'
  }
  if (duration < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the lock duration is equal to or longer than 1 minute.'
  }
  return null
}

function reduceFields(fields, [field, value]) {
  if (field === 'tokenAddress') {
    return { ...fields, tokenAddress: value }
  }
  if (field === 'lockDuration') {
    return { ...fields, lockDuration: value }
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
    { lockDuration, tokenAddress, lockAmount, spamPenalty },
    updateField,
  ] = useReducer(reduceFields, {
    lockDuration: screenData.lockDuration || DEFAULT_DURATION,
    tokenAddress: screenData.tokenAddress || '',
    lockAmount: screenData.lockAmount || '',
    spamPenalty: screenData.spamPenalty || SPAM_PENALTY_DEFAULT,
  })

  const handleDurationChange = useCallback(value => {
    setFormError(null)
    updateField(['lockDuration', value])
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
    const value = parseInt(event.target.value, 10)
    setFormError(null)
    updateField(['lockAmount', isNaN(value) ? -1 : value])
  }, [])

  const handleClearTokenAddress = useCallback(() => {
    setFormError(null)
    updateField(['tokenAddress', ''])
  }, [])

  const prevNextRef = useRef()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(lockDuration, tokenAddress, lockAmount)
      setFormError(error)

      if (!error) {
        const screenData = {
          tokenAddress,
          lockDuration,
          spamPenalty,
          lockAmount,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [lockDuration, tokenAddress, lockAmount, spamPenalty, next, dataKey, data]
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
            value={lockAmount === -1 ? '' : lockAmount}
            wide
          />
        </Field>
      </div>

      <Duration
        duration={lockDuration}
        onUpdate={handleDurationChange}
        label={
          <React.Fragment>
            {DURATION_LABEL}
            <Help hint="What’s the lock duration?">{DURATION_HELP_TEXT}</Help>
          </React.Fragment>
        }
      />

      <PercentageField
        label={
          <React.Fragment>
            Spam penalty %
            <Help hint="What’s the spam penalty?">
              <strong>Spam penalty</strong>
              Is a % of the base lock amount and lock duration. The more active
              locks an account has, the more tokens will have to lock and for a
              longer period of time for subsequent proposals.
            </Help>
          </React.Fragment>
        }
        value={spamPenalty}
        onChange={handleSpamPenaltyChange}
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
    // TODO: Show token name and symbol
    ['Token address', `${screenData.tokenAddress}`],
    ['Lock amount', `${screenData.lockAmount} tokens`],
    ['Lock duration', formatDuration(screenData.lockDuration)],
    ['Spam penalty', `${screenData.spamPenalty} %`],
  ]
}

LockScreen.formatReviewFields = formatReviewFields
export default LockScreen
