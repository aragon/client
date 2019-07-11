import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Box, Button, GU, TextInput, Text, theme } from '@aragon/ui'
import { login } from './notification-service-api'
import { AUTH_PREVERIFY } from './constants'

export default function NotificationsLogin({
  dao,
  authState,
  email,
  onEmailChange,
}) {
  const [inputEmail, setInputEmail] = useState('')
  const [loginError, setloginError] = useState(null)
  const [loginSubmitted, setloginSubmitted] = useState(false)

  const handleEmailChange = e => {
    setInputEmail(e.target.value)
  }

  const handleLogin = async e => {
    try {
      await login(inputEmail, dao)
      onEmailChange(inputEmail)
      setloginSubmitted(true)
    } catch (e) {
      setloginError(e)
      console.error('Failed to login', e)
    }
  }

  const handleRelogin = async e => {
    try {
      await login(email, dao)
      setloginSubmitted(true)
    } catch (e) {
      setloginError(e)
      console.error('Failed to login', e)
    }
  }

  if (authState === AUTH_PREVERIFY) {
    return (
      <Box heading="Email notifications">
        <div>
          <Text size="xsmall">Awaiting verification of {email}</Text>
        </div>
        <Button mode="strong" disabled={loginSubmitted} onClick={handleRelogin}>
          Re-login
        </Button>
      </Box>
    )
  }

  return (
    <Box heading="Email notifications">
      {loginError && (
        <Text color={theme.negative} size="xsmall">
          Error logging in {loginError.toString()}
        </Text>
      )}
      <Label>
        Email address:{' '}
        <TextInput value={inputEmail} wide onChange={handleEmailChange} />
      </Label>
      <Button mode="strong" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  )
}

const Label = styled.label`
  display: block;
  margin-bottom: ${2 * GU}px;
`

NotificationsLogin.propTypes = {
  dao: PropTypes.string,
  authState: PropTypes.string,
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
