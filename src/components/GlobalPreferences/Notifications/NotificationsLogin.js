import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Box, Button, GU, TextInput, Text, Info, IconMail } from '@aragon/ui'
import { login } from './notification-service-api'
import { AUTH_PREVERIFY } from './constants'
import { getEthNetworkType } from '../../../local-settings'
import notificationSvg from './notifications.svg'
import checkmarkSvg from './check-mark.svg'

export default function NotificationsLogin({
  dao,
  authState,
  email,
  onEmailChange,
}) {
  const [inputEmail, setInputEmail] = useState('')
  const [apiError, setApiError] = useState(null)
  const network = getEthNetworkType()

  const handleEmailChange = e => {
    setInputEmail(e.target.value)
  }

  const handleLogin = async e => {
    try {
      await login({ email: inputEmail, dao, network })
      onEmailChange(inputEmail)
    } catch (e) {
      setApiError(e.message)
      console.error('Failed to login', e)
    }
  }

  if (authState === AUTH_PREVERIFY) {
    return (
      <Box heading="Email notifications">
        <NotificationImage />
        <div>
          <Checkmark />
          <Text>Awaiting verification. Please check your email!</Text>
          <br />
          <Text size="xsmall">
            We’ve sent an email to {email}. Verify your email address so you can
            manage your notifications subscriptions.
          </Text>
        </div>
      </Box>
    )
  }
  return (
    <Box heading="Email notifications">
      <NotificationImage />
      {apiError && <Info mode="error">Error logging in:{apiError}</Info>}
      <Label>Email address</Label>
      <TextInput
        css={`
          width: 80%;
          margin-right: 9px;
          margin-bottom: 10px;
        `}
        type="email"
        placeholder="you@example.com"
        wide
        value={inputEmail}
        onChange={handleEmailChange}
      />
      <Button onClick={handleLogin}>
        <IconMail /> Sign in
      </Button>
      <Info>
        Receive email notifications for the new app events. For example,
        whenever a new vote is created or when tokens added, you’ll get an email
        informing you of the latest activity in your organization. How does it
        work? You will be asked to enter with your email address whenever using
        a different browser session or device to access your subsciptions. This
        process doens’t require a password, just for you to confirm your email
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

const Checkmark = () => (
  <img
    src={checkmarkSvg}
    alt="check mark"
    css={`
      display: inline block;
      margin: ${1 * GU}px auto;
    `}
  />
)

const Label = styled.label`
  display: block;
`

NotificationsLogin.propTypes = {
  dao: PropTypes.string,
  authState: PropTypes.string,
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
