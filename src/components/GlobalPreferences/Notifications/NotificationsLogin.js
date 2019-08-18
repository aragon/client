import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Box, Button, GU, TextInput, Info, IconMail } from '@aragon/ui'
import { login } from './notification-service-api'
import { network } from '../../../environment'
import notificationSvg from './notifications.svg'

export default function NotificationsLogin({
  dao,
  authState,
  email,
  onEmailChange,
}) {
  const [inputEmail, setInputEmail] = useState('')
  const [apiError, setApiError] = useState(null)
  const ethNetwork = network.type === 'main' ? 'mainnet' : 'rinkeby'

  const handleEmailChange = e => {
    setInputEmail(e.target.value)
  }

  const handleLogin = async e => {
    try {
      await login({ email: inputEmail, dao, network: ethNetwork })
      onEmailChange(inputEmail)
    } catch (e) {
      setApiError(e.message)
      console.error('Failed to login', e)
    }
  }

  return (
    <Box heading="Email notifications">
      <NotificationImage />
      {apiError && <Info mode="error">Error logging in.</Info>}
      <Label>Email address</Label>
      <div
        css={`
          display: grid;
          align-items: center;
          grid-template-columns: 1fr auto;
          grid-gap: ${2 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <TextInput
          type="email"
          placeholder="you@example.com"
          wide
          value={inputEmail}
          onChange={handleEmailChange}
        />
        <Button
          css={`
            width: ${16 * GU}px;
          `}
          onClick={handleLogin}
        >
          <IconMail /> Sign in
        </Button>
      </div>
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

const Label = styled.label`
  display: block;
`

NotificationsLogin.propTypes = {
  dao: PropTypes.string,
  authState: PropTypes.string,
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
