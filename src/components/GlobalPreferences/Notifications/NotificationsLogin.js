import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  GU,
  TextInput,
  Info,
  IconMail,
  Text,
  useTheme,
} from '@aragon/ui'
import { login } from './notification-service-api'
import { network } from '../../../environment'
import { validateEmail } from '../../../utils'
import notificationSvg from './notifications.svg'

export default function NotificationsLogin({ dao, authState, onEmailChange }) {
  const [inputEmail, setInputEmail] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [apiError, setApiError] = useState(null)
  const ethNetwork = network.type === 'main' ? 'mainnet' : 'rinkeby'

  const handleEmailChange = e => {
    setEmailInvalid(!validateEmail(e.target.value))

    setInputEmail(e.target.value)
  }

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
              type="email"
              placeholder="you@example.com"
              wide
              value={inputEmail}
              onChange={handleEmailChange}
            />
          </label>

          <Button
            disabled={emailInvalid || inputEmail.length === 0}
            css={`
              width: ${16 * GU}px;
            `}
            onClick={handleLogin}
          >
            <IconMail /> Sign in
          </Button>
          {apiError && <Text color={theme.negative}>Error logging in</Text>}
          {emailInvalid && (
            <Text color={theme.negative}>
              Please enter a valid email address
            </Text>
          )}
        </div>
      </form>

      <Info>
        Receive email notifications for new events in this organization. For
        example, whenever a new vote is created or when tokens added, you’ll get
        an email informing you of the latest activity in your organization. How
        does it work? You will be asked to enter with your email address
        whenever using a different browser session or device to access your
        subsciptions. This process doens’t require a password, just for you to
        confirm your email address.
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
  authState: PropTypes.string,
  onEmailChange: PropTypes.func,
}
