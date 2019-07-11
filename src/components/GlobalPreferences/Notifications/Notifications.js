import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  GU,
  LoadingRing,
  TextInput,
  Text,
  theme,
} from '@aragon/ui'
import Subscriptions from './Subscriptions'
import { login, verifyEmailToken } from './notification-service-api'

const NOTIFICATION_SERVICE_EMAIL_KEY = 'NOTIFICATION_SERVICE_EMAIL_KEY'
const NOTIFICATION_SERVICE_TOKEN_KEY = 'NOTIFICATION_SERVICE_TOKEN_KEY'
const VERIFY_SUBSECTION = '/verify/'

// A user can be in one of these three states
// Only once the user is verified (authenticated) can he create subscriptions
const AUTH_UNAUTHENTICATED = 'AUTH_UNAUTHENTICATED'
const AUTH_PREVERIFY = 'AUTH_PREVERIFY' // submitted email but didn't verify
const AUTH_AUTHENTICATED = 'AUTH_AUTHENTICATED'

// Hook responsible for deriving the authState from localStorage values and
// provide setters which update the localStorage
function useAuthState(navigateToNotifications) {
  const [authState, setAuthState] = useState(AUTH_UNAUTHENTICATED)
  const [email, setEmail] = useState(
    localStorage.getItem(NOTIFICATION_SERVICE_EMAIL_KEY)
  )
  const [token, setToken] = useState(
    localStorage.getItem(NOTIFICATION_SERVICE_TOKEN_KEY)
  )

  useEffect(() => {
    if (!email && !token) {
      setAuthState(AUTH_UNAUTHENTICATED)
      return
    }

    if (email && !token) {
      setAuthState(AUTH_PREVERIFY)
      return
    }

    if (email && token) {
      setAuthState(AUTH_AUTHENTICATED)
    }
  }, [email, token])

  useEffect(() => {
    token && localStorage.setItem(NOTIFICATION_SERVICE_TOKEN_KEY, token)
    navigateToNotifications()
    // TODO: handle routing to subscriptions
  }, [navigateToNotifications, token])

  useEffect(() => {
    email && localStorage.setItem(NOTIFICATION_SERVICE_EMAIL_KEY, email)
  }, [email])

  return {
    authState,
    email,
    token,
    handleTokenChange: setToken,
    handleEmailChange: setEmail,
  }
}

function Notifications({ subsection, dao, handleNavigation, navigationIndex }) {
  const navigateToNotifications = useCallback(
    () => handleNavigation(navigationIndex),
    [handleNavigation, navigationIndex]
  )
  const {
    authState,
    email,
    token,
    handleTokenChange,
    handleEmailChange,
  } = useAuthState(navigateToNotifications)

  if (authState === AUTH_AUTHENTICATED) {
    return <Subscriptions email={email} token={token} />
  }

  if (subsection.startsWith(VERIFY_SUBSECTION)) {
    return (
      <NotificationsVerify
        subsection={subsection}
        onTokenChange={handleTokenChange}
      />
    )
  }

  return (
    <NotificationsLogin
      dao={dao}
      email={email}
      authState={authState}
      onEmailChange={handleEmailChange}
    />
  )
}

Notifications.propTypes = {
  subsection: PropTypes.string,
  dao: PropTypes.string,
  handleNavigation: PropTypes.func,
  navigationIndex: PropTypes.func,
}

function NotificationsLogin({ dao, authState, email, onEmailChange }) {
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

NotificationsLogin.propTypes = {}

function NotificationsVerify({ subsection, onTokenChange }) {
  const [verifyError, setVerifyError] = useState(null)
  const token = subsection.substring(VERIFY_SUBSECTION.length)

  useEffect(() => {
    verifyEmailToken(token)
      .then(longLivedToken => {
        onTokenChange(longLivedToken)
        return longLivedToken
      })
      .catch(e => {
        setVerifyError(e)
        console.error(e)
      })
  }, [token, onTokenChange])

  return (
    <Box heading="Email notifications">
      <LoadingRing />
      {verifyError && verifyError.toString()}
    </Box>
  )
}

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
}

const Label = styled.label`
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default Notifications
