import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import { ButtonText, GU, LoadingRing, textStyle } from '@aragon/ui'
import ManageNotifications from './ManageNotifications'
import NotificationsLogin from './NotificationsLogin'
import {
  NotificationsVerify,
  NotificationsPreVerify,
} from './NotificationsVerify'
import NotificationsInfoBox, {
  ICON_ERROR,
  IMAGE_NETWORK_ERROR,
  IMAGE_ERROR,
} from './NotificationsInfoBox'
import { isAuthTokenValid } from './notification-service-api'

import {
  AUTH_UNAUTHENTICATED,
  AUTH_PREVERIFY,
  AUTH_AUTHENTICATED,
  AUTH_AUTHENTICATION_FAILED,
  AUTH_SERVICE_UNAVAILABLE,
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

  const handleAuthenticate = useCallback(() => {
    setAuthState(AUTH_AUTHENTICATING)
    isAuthTokenValid(token)
      .then(v => {
        setAuthState(AUTH_AUTHENTICATED)
        return v
      })
      .catch(e => {
        if (e instanceof TypeError) {
          // network/service error
          setAuthState(AUTH_SERVICE_UNAVAILABLE)
        } else {
          setAuthState(AUTH_AUTHENTICATION_FAILED)
        }
      })
  }, [setAuthState, token])

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
      handleAuthenticate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const setServiceUnavailable = useCallback(() => {
    setAuthState(AUTH_SERVICE_UNAVAILABLE)
  }, [setAuthState])

  return {
    authState,
    email,
    token,
    handleTokenChange: setToken,
    handleEmailChange: setEmail,
    handleLogout,
    setServiceUnavailable,
    handleAuthenticate,
  }
}

export default function Notifications({
  apps,
  subsection,
  dao,
  handleNavigation,
  navigationIndex,
}) {
  const {
    authState,
    email,
    token,
    handleAuthenticate,
    handleTokenChange,
    handleEmailChange,
    handleLogout,
    setServiceUnavailable,
  } = useAuthState()

  const navigateToNotifications = useCallback(
    () => handleNavigation(navigationIndex),
    [handleNavigation, navigationIndex]
  )

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
      return (
        <NotificationsPreVerify
          email={email}
          onEmailChange={handleEmailChange}
        />
      )
    case AUTH_AUTHENTICATED:
      return (
        <ManageNotifications
          onServiceUnavailable={setServiceUnavailable}
          dao={dao}
          onLogout={handleLogout}
          apps={apps}
          email={email}
          token={token}
        />
      )
    case AUTH_AUTHENTICATING:
      return (
        <NotificationsInfoBox>
          <div
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: ${25 * GU}px;
            `}
          >
            <LoadingRing />
            <p
              css={`
                margin-left: ${GU}px;
                ${textStyle('body1')};z
              `}
            >
              Authenticating...
            </p>
          </div>
        </NotificationsInfoBox>
      )
    case AUTH_AUTHENTICATION_FAILED:
      return (
        <NotificationsInfoBox
          header="Authentication Failed"
          icon={ICON_ERROR}
          image={IMAGE_ERROR}
        >
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
        </NotificationsInfoBox>
      )
    case AUTH_SERVICE_UNAVAILABLE:
      return (
        <NotificationsInfoBox
          header="Error connecting to the Notifications server"
          icon={ICON_ERROR}
          image={IMAGE_NETWORK_ERROR}
        >
          <div>
            There was an error when trying to connect to the Notifications
            server. Please
            <ButtonText
              css={`
                font-weight: bold;
              `}
              onClick={handleLogout}
            >
              sign out
            </ButtonText>
            or
            <ButtonText
              css={`
                font-weight: bold;
              `}
              onClick={handleAuthenticate}
            >
              try again.
            </ButtonText>
          </div>
        </NotificationsInfoBox>
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
