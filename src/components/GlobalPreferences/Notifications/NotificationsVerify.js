import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, GU, LoadingRing, textStyle } from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import {
  VERIFY_SUBSECTION,
  SUCCESSFUL_VERIFICATION_REDIRECTION_DELAY,
  ExpiredTokenError,
} from './constants'
import NotificationsInfoBox, {
  ICON_SUCCESS,
  ICON_ERROR,
  ICON_NEUTRAL,
  IMAGE_ERROR,
  IMAGE_NORMAL,
} from './NotificationsInfoBox'

export function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  const [isFetching, setIsFetching] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)

  const handleResetAccount = useCallback(() => {
    // In error states we can clear email and token to reset the state
    onEmailChange(null)
    onTokenChange(null)
    navigateToNotifications()
  }, [onEmailChange, onTokenChange, navigateToNotifications])

  useEffect(() => {
    let cancelled = false
    // Parse token from subsection /verify/[TOKEN] -> [TOKEN]
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        if (!cancelled) {
          setVerified(true)
          setIsFetching(false)
          onTokenChange(longLivedToken)
        }
        return longLivedToken
      })
      .catch(e => {
        if (!cancelled) {
          setError(e)
          setIsFetching(false)
          setVerified(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [subsection, onTokenChange, onEmailChange])

  // Redirect user automatically after 10 seconds
  useEffect(() => {
    let timeoutId
    if (verified) {
      timeoutId = setTimeout(() => {
        navigateToNotifications()
      }, SUCCESSFUL_VERIFICATION_REDIRECTION_DELAY)
    }
    return () => {
      timeoutId && clearTimeout(timeoutId)
    }
  }, [navigateToNotifications, verified])

  if (isFetching) {
    return (
      <NotificationsInfoBox image={IMAGE_NORMAL}>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingRing />
          <p
            css={`
              margin-left: ${GU}px;
              ${textStyle('body1')};
            `}
          >
            Verifying...
          </p>
        </div>
      </NotificationsInfoBox>
    )
  }
  if (verified) {
    return (
      <NotificationsInfoBox
        header="Verification Successful"
        image={IMAGE_NORMAL}
        icon={ICON_SUCCESS}
      >
        <div>
          Your email was verified and now you can subscribe to app events to
          receive email notifications. You may close this tab or{' '}
          <Link
            css={`
              font-weight: bold;
            `}
            onClick={navigateToNotifications}
          >
            go to Notification preferences
          </Link>
          .
        </div>
      </NotificationsInfoBox>
    )
  }

  let message
  if (error && error instanceof ExpiredTokenError) {
    message = <div>The link you used to verify your email has expired.</div>
  } else if (error && error instanceof TypeError) {
    message = (
      <div>
        There was an error when trying to connect to the Notifications server.
      </div>
    )
  } else {
    message = (
      <div>Something has gone wrong during the email verification process.</div>
    )
  }

  return (
    <NotificationsInfoBox
      header="Verification Failed"
      icon={ICON_ERROR}
      image={IMAGE_ERROR}
    >
      {message} Don't worry, you can go back and
      <Link
        css={`
          font-weight: bold;
        `}
        onClick={handleResetAccount}
      >
        try to sign in again
      </Link>
      .
    </NotificationsInfoBox>
  )
}

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
  onEmailChange: PropTypes.func,
  navigateToNotifications: PropTypes.func,
}

export function NotificationsPreVerify({ email, onEmailChange }) {
  const handleResetEmail = useCallback(() => onEmailChange(null), [
    onEmailChange,
  ])
  return (
    <NotificationsInfoBox
      icon={ICON_NEUTRAL}
      header="Awaiting verification. Please check your email!"
    >
      <p>
        We’ve sent an email to <strong>{email}</strong>. Verify your email
        address so you can manage your notifications subscriptions.
      </p>
      <p>
        Something went wrong?{' '}
        <Link
          css={`
            font-weight: bold;
          `}
          onClick={handleResetEmail}
        >
          Go back and try to sign in again
        </Link>
        .
      </p>
    </NotificationsInfoBox>
  )
}
NotificationsPreVerify.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
