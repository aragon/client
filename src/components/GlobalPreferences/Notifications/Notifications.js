import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import { ButtonText, LoadingRing, useTheme } from '@aragon/ui'
import ManageNotifications from './ManageNotifications'
import NotificationsLogin from './NotificationsLogin'
import {
  NotificationsVerify,
  NotificationsPreVerify,
} from './NotificationsVerify'
import NotificationsVerifyBox from './NotificationsVerifyBox'
import { isAuthTokenValid } from './notification-service-api'

import {
  AUTH_UNAUTHENTICATED,
  AUTH_PREVERIFY,
  AUTH_AUTHENTICATED,
  AUTH_AUTHENTICATION_FAILED,
  NOTIFICATION_SERVICE_EMAIL_KEY,
  NOTIFICATION_SERVICE_TOKEN_KEY,
  VERIFY_SUBSECTION,
  AUTH_AUTHENTICATING,
} from './constants'

// Hook responsible for deriving the authState from localStorage values and
// providing setters which update the localStorage
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
      setAuthState(AUTH_AUTHENTICATING)
      isAuthTokenValid(token)
        .then(v => {
          setAuthState(AUTH_AUTHENTICATED)
          return v
        })
        .catch(e => {
          setAuthState(AUTH_AUTHENTICATION_FAILED)
        })
    }
  }, [email, token])

  useEffect(() => {
    token
      ? localStorage.setItem(NOTIFICATION_SERVICE_TOKEN_KEY, token)
      : localStorage.removeItem(NOTIFICATION_SERVICE_TOKEN_KEY)
  }, [token])

  useEffect(() => {
    email
      ? localStorage.setItem(NOTIFICATION_SERVICE_EMAIL_KEY, email)
      : localStorage.removeItem(NOTIFICATION_SERVICE_EMAIL_KEY)
  }, [email])

  const handleLogout = useCallback(() => {
    setEmail(null)
    setToken(null)
  }, [setToken, setEmail])

  return {
    authState,
    email,
    token,
    handleTokenChange: setToken,
    handleEmailChange: setEmail,
    handleLogout,
  }
}

export default function Notifications({
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
    handleLogout,
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

  switch (authState) {
    case AUTH_PREVERIFY:
      return <NotificationsPreVerify email={email} />
    case AUTH_AUTHENTICATED:
      return (
        <ManageNotifications
          dao={dao}
          onLogout={handleLogout}
          apps={apps}
          email={email}
          token={token}
        />
      )
    case AUTH_AUTHENTICATING:
      return (
        <NotificationsVerifyBox header="Authenticating">
          <div
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <LoadingRing />
          </div>
        </NotificationsVerifyBox>
      )
    case AUTH_AUTHENTICATION_FAILED:
      return (
        <NotificationsVerifyBox header="Authentication Failed">
          <div>
            Authentication was unsuccessful.{' '}
            <ButtonText
              css={`
                font-weight: bold;
              `}
              onClick={handleLogout}
            >
              Try logging in again.
            </ButtonText>
          </div>
        </NotificationsVerifyBox>
      )
    case AUTH_UNAUTHENTICATED:
    default:
      return (
        <NotificationsLogin
          dao={dao}
          authState={authState}
          onEmailChange={handleEmailChange}
        />
      )
  }
}

Notifications.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  subsection: PropTypes.string,
  dao: PropTypes.string,
  handleNavigation: PropTypes.func,
  navigationIndex: PropTypes.number,
}
