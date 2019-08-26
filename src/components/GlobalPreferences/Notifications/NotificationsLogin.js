import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  GU,
  TextInput,
  Info,
  IconMail,
  IconCross,
  IconCheck,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { login } from './notification-service-api'
import { network } from '../../../environment'
import { validateEmail } from '../../../utils'
import notificationSvg from './notifications.svg'
import throttle from 'lodash.throttle'

export default function NotificationsLogin({ dao, authState, onEmailChange }) {
  const [inputEmail, setInputEmail] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(null)
  const [apiError, setApiError] = useState(null)
  // The notifications API expects mainnet or rinkeby. This deviates from web3's getNetworkType which returns main
  const ethNetwork = network.type === 'main' ? 'mainnet' : 'rinkeby'

  const handleEmailValidation = useCallback(
    throttle(email => {
      if (email.length > 3 && email.includes('@')) {
        setEmailInvalid(!validateEmail(email))
      }
    }, 600),
    [setEmailInvalid]
  )
  const handleEmailBlur = useCallback(
    e => {
      const email = e.target.value
      setEmailInvalid(!validateEmail(email))
    },
    [setEmailInvalid]
  )

  const handleEmailChange = useCallback(
    e => {
      const email = e.target.value
      setInputEmail(email)
      handleEmailValidation(email)
    },
    [handleEmailValidation, setInputEmail]
  )

  const handleLogin = async e => {
    e && e.preventDefault()
    try {
      await login({ email: inputEmail, dao, network: ethNetwork })
      onEmailChange(inputEmail)
    } catch (e) {
      setApiError(e.message)
      console.error('Failed to login', e)
    }
  }

  const theme = useTheme()

  return (
    <Box heading="Email notifications">
      <NotificationImage />
      <form onSubmit={handleLogin}>
        <div
          css={`
            display: grid;
            align-items: end;
            grid-template-columns: 1fr auto;
            grid-gap: ${GU}px ${2 * GU}px;
            margin-bottom: ${2 * GU}px;
          `}
        >
          <label
            css={`
              color: ${theme.surfaceContentSecondary};
              display: block;
            `}
          >
            Email address
            <TextInput
              css={`
                border-color: ${emailInvalid === true
                  ? theme.error
                  : theme.border};
              `}
              adornment={
                emailInvalid === false ? (
                  <IconCheck
                    css={`
                      color: ${theme.positive};
                    `}
                  />
                ) : inputEmail.trim() ? (
                  <IconCross
                    css={`
                      color: ${theme.negative};
                    `}
                  />
                ) : null
              }
              adornmentPosition="end"
              type="email"
              placeholder="you@example.com"
              wide
              value={inputEmail}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
          </label>

          <Button
            disabled={emailInvalid !== false}
            css={`
              width: ${16 * GU}px;
            `}
            onClick={handleLogin}
            icon={<IconMail />}
            label="Sign in"
          />
          {apiError && (
            <p
              css={`
                color: ${theme.negative};
                ${textStyle('body2')};
              `}
            >
              Error logging in. Please try again
            </p>
          )}
          {emailInvalid && (
            <p
              css={`
                color: ${theme.negative};
                ${textStyle('body2')};
              `}
            >
              Please enter a valid email address
            </p>
          )}
        </div>
      </form>

      <Info>
        Receive email notifications for new events in this organization. For
        example, whenever a new vote is created or when funds are transferred,
        you’ll get an email informing you of the latest activity in your
        organization. How does it work? <br /> You will be asked to enter with
        your email address whenever using a different browser session or device
        to access your subsciptions. This process doesn't require a password;
        you just need to confirm your email just for you to confirm your email
        address.
      </Info>
    </Box>
  )
}

const NotificationImage = () => (
  <img
    src={notificationSvg}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 193px;
    `}
  />
)

NotificationsLogin.propTypes = {
  dao: PropTypes.string,
  authState: PropTypes.symbol,
  onEmailChange: PropTypes.func,
}
