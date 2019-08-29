import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, Button, GU, Info, LoadingRing, useTheme } from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import { VERIFY_SUBSECTION, ExpiredTokenError } from './constants'
import NotificationsVerifyBox, {
  ICON_SUCCESS,
  ICON_ERROR,
  ICON_NEUTRAL,
} from './NotificationsVerifyBox'

export function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  const [isFetching, setIsFetching] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

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

  if (isFetching) {
    return (
      <NotificationsVerifyBox header="Verifying">
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
  }
  if (verified) {
    return (
      <NotificationsVerifyBox
        header="Verification Successful"
        icon={ICON_SUCCESS}
      >
        <div>
          Your email was verified and now you can subscribe to app events to
          receive email notifications. You may close this tab or{' '}
          <ButtonBase
            css={`
              font-weight: bold;
              color: ${theme.link};
              cursor: pointer;
            `}
            onClick={navigateToNotifications}
          >
            go to Notification preferences.
          </ButtonBase>
        </div>
      </NotificationsVerifyBox>
    )
  }

  if (error && error instanceof ExpiredTokenError) {
    return (
      <NotificationsVerifyBox header="Verification Failed" icon={ICON_ERROR}>
        <div>
          The link you clicked to verify your email is not longer valid due to
          expiration.{' '}
        </div>
        Do not worry, you can go back and{' '}
        <ButtonBase
          css={`
            font-weight: bold;
            color: ${theme.link};
            cursor: pointer;
          `}
          onClick={handleResetAccount}
        >
          try to sign in again.
        </ButtonBase>
      </NotificationsVerifyBox>
    )
  }

  if (error && error instanceof TypeError) {
    return (
      <NotificationsVerifyBox header="Verification Failed" icon={ICON_ERROR}>
        <div>
          There was an error when trying to connect to the Notifications server.
          Do not worry, you can go back and{' '}
          <ButtonBase
            css={`
              font-weight: bold;
              color: ${theme.link};
              cursor: pointer;
            `}
            onClick={handleResetAccount}
          >
            try to sign in again.
          </ButtonBase>
        </div>
      </NotificationsVerifyBox>
    )
  }

  return (
    <NotificationsVerifyBox header="Verification Failed" icon={ICON_ERROR}>
      <div>
        Something has gone wrong during the email verification process. Do not
        worry, you can go back and{' '}
        <ButtonBase
          css={`
            font-weight: bold;
            color: ${theme.link};
            cursor: pointer;
          `}
          onClick={handleResetAccount}
        >
          try to sign in again.
        </ButtonBase>
      </div>
    </NotificationsVerifyBox>
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
  const theme = useTheme()
  return (
    <NotificationsVerifyBox
      icon={ICON_NEUTRAL}
      header="Awaiting verification. Please check your email!"
    >
      <p>
        We’ve sent an email to <strong>{email}</strong>. Verify your email
        address so you can manage your notifications subscriptions.
      </p>
      <p>
        Something went wrong?{' '}
        <ButtonBase
          css={`
            font-weight: bold;
            color: ${theme.link};
            cursor: pointer;
          `}
          onClick={handleResetEmail}
        >
          Go back and try to sign in again.
        </ButtonBase>
      </p>
    </NotificationsVerifyBox>
  )
}
NotificationsPreVerify.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
