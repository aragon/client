import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
// import { Box } from '@aragon/ui'
import Subscriptions from './Subscriptions'
import NotificationsLogin from './NotificationsLogin'
import NotificationsVerify from './NotificationsVerify'

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
function useAuthState() {
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
  }, [token])

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

function Notifications({
  apps,
  subsection,
  dao,
  handleNavigation,
  navigationIndex,
}) {
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
  } = useAuthState()

  if (subsection && subsection.startsWith(VERIFY_SUBSECTION)) {
    return (
      <NotificationsVerify
        subsection={subsection}
        onTokenChange={handleTokenChange}
        onEmailChange={handleEmailChange}
        navigateToNotifications={navigateToNotifications}
      />
    )
  }

  if (authState === AUTH_AUTHENTICATED) {
    // TODO: make sure token is valid
    return <Subscriptions apps={apps} email={email} token={token} />
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
  apps: PropTypes.arrayOf(AppType).isRequired,
  subsection: PropTypes.string,
  dao: PropTypes.string,
  handleNavigation: PropTypes.func,
  navigationIndex: PropTypes.number,
}

export default Notifications
