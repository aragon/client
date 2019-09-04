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

export default function NotificationsLogin({
  dao,
  onEmailChange,
  hasLoggedOut,
}) {
  const [inputEmail, setInputEmail] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(null)
  const [apiError, setApiError] = useState(null)
  // The notifications API expects mainnet or rinkeby. This deviates from web3's getNetworkType which returns main
  const ethNetwork = network.type === 'main' ? 'mainnet' : 'rinkeby'

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
      if (validateEmail(email)) {
        // Set only as valid while user typing. Use blur to set invalid
        setEmailInvalid(false)
      }
    },
    [setInputEmail, setEmailInvalid]
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
                ) : (
                  // hidden icon to avoid losing focus
                  <IconCheck
                    css={`
                      opacity: 0;
                    `}
                  />
                )
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
                ${textStyle('body4')};
              `}
            >
              Error logging in. Please try again
            </p>
          )}
          {emailInvalid && (
            <p
              css={`
                color: ${theme.negative};
                ${textStyle('body4')};
              `}
            >
              Please enter a valid email address
            </p>
          )}
        </div>
      </form>

      <Info>
        {hasLoggedOut
          ? `You need to enter with your email address because your are using a
        different browser session or device to access your subsciptions. This
        process doens’t require a password, just for you to confirm your email
        address.`
          : `Receive email notifications for the new app events. For
        example, whenever a new vote is created or when tokens added, you’ll get
        an email informing you of the latest activity in your organization. You
        will be asked to enter with your email address whenever using a
        different browser session or device to access your subsciptions. This
        process doens’t require a password, just for you to confirm your email
        address whenever you want to sing in.`}
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
  onEmailChange: PropTypes.func,
  hasLoggedOut: PropTypes.bool,
}
