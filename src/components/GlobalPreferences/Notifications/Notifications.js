import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, LoadingRing } from '@aragon/ui'
import Subscriptions from './Subscriptions'
import NotificationsLogin from './NotificationsLogin'
import { verifyEmailToken } from './notification-service-api'

import {
  AUTH_UNAUTHENTICATED,
  AUTH_PREVERIFY,
  AUTH_AUTHENTICATED,
  NOTIFICATION_SERVICE_EMAIL_KEY,
  NOTIFICATION_SERVICE_TOKEN_KEY,
  VERIFY_SUBSECTION,
} from './constants'

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
  navigationIndex: PropTypes.number,
}

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

export default Notifications
