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
import { validateEmail } from '../../../util/utils'
import { useRouting } from '../../../routing'
import notificationPng from './notifications.png'
import { useWallet } from '../../../contexts/wallet'

export default function NotificationsLogin({ onEmailChange, hasLoggedOut }) {
  const [inputEmail, setInputEmail] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(null)
  const [apiError, setApiError] = useState(null)
  const { networkType } = useWallet()

  const { mode } = useRouting()

  const handleEmailBlur = useCallback(e => {
    const email = e.target.value
    setEmailInvalid(!validateEmail(email))
  }, [])

  const handleEmailChange = useCallback(e => {
    const email = e.target.value
    setInputEmail(email)
    if (validateEmail(email)) {
      // Set only as valid while user typing. Use blur to set invalid
      setEmailInvalid(false)
    }
  }, [])

  const handleLogin = useCallback(
    async e => {
      e && e.preventDefault()

      if (!validateEmail(inputEmail)) {
        setEmailInvalid(true)
        return
      }

      try {
        await login({ networkType, email: inputEmail, dao: mode.orgAddress })
        onEmailChange(inputEmail)
      } catch (e) {
        setApiError(e.message)
        console.error('Failed to login', e)
      }
    },
    [mode, inputEmail, onEmailChange, networkType]
  )

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
                emailInvalid ? (
                  <IconCross
                    css={`
                      color: ${theme.negative};
                    `}
                  />
                ) : (
                  <IconCheck
                    css={`
                      opacity: ${inputEmail.trim() ? '1' : '0'};
                      color: ${theme.positive};
                    `}
                  />
                )
              }
              adornmentPosition="end"
              type="email"
              placeholder="you@example.org"
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
          ? `You need to enter with your email address because you are using a
        different browser session or device to access your subsciptions. This
        process doens’t require a password, just for you to confirm your email
        address.`
          : `Receive email notifications for new app events. For example,
        whenever a new vote is created or when funds are transferred, you’ll get
        an email informing you of this activity in your organization.
        This process doesn’t require a password. You will be asked to enter
        your email address whenever using a different browser session
        or device to access your notification subscriptions. The email address
        you enter here is only used to send you notifications that you have
        explicitly opted into and will not be shared, rented,
        or sold for any marketing purposes.`}
      </Info>
    </Box>
  )
}

const NotificationImage = () => (
  <img
    src={notificationPng}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 193px;
    `}
  />
)

NotificationsLogin.propTypes = {
  onEmailChange: PropTypes.func,
  hasLoggedOut: PropTypes.bool,
}
