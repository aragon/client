import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, Button, GU, Info, LoadingRing, useTheme } from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import { VERIFY_SUBSECTION, ExpiredTokenError } from './constants'
import NotificationsVerifyBox from './NotificationsVerifyBox'

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
  }, [onEmailChange, onTokenChange])

  useEffect(() => {
    // Parse token from subsection /verify/[TOKEN] -> [TOKEN]
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        setVerified(true)
        setIsFetching(false)
        onTokenChange(longLivedToken)
        return longLivedToken
      })
      .catch(e => {
        setError(e)
        setIsFetching(false)
        setVerified(false)
      })
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
      <NotificationsVerifyBox header="Verification Successful" success>
        <div>
          Your email was verified and now you can subscribe to app events to
          receive email notifications.{' '}
          <ButtonBase
            css={`
              font-weight: bold;
              color: ${theme.link};
              cursor: pointer;
            `}
            onClick={navigateToNotifications}
          >
            Go to Notification preferences.
          </ButtonBase>
        </div>
      </NotificationsVerifyBox>
    )
  }

  if (error && error instanceof ExpiredTokenError) {
    return (
      <NotificationsVerifyBox header="Verification Failed">
        <div>
          <Info mode="error">Your email link has expired.</Info>
        </div>
        <ResetButton onClick={handleResetAccount} />
      </NotificationsVerifyBox>
    )
  }

  if (error && error instanceof TypeError) {
    return (
      <NotificationsVerifyBox header="Verification Failed">
        <div>
          <Info mode="error">
            Oops, it looks like there was a problem accessing the service.
            Please try again.
          </Info>
        </div>
        <ResetButton onClick={handleResetAccount} />
      </NotificationsVerifyBox>
    )
  }

  return (
    <NotificationsVerifyBox header="Verification Failed">
      <div>
        <Info mode="error">
          Oops, it looks like something is wrong with the and you weren't
          authorized. Please try again.
        </Info>
      </div>
      <ResetButton onClick={handleResetAccount} />
    </NotificationsVerifyBox>
  )
}

const ResetButton = ({ onClick }) => (
  <Button
    css={`
      margin-top: ${GU}px;
    `}
    onClick={onClick}
    label="Reset email"
  />
)

ResetButton.propTypes = {
  onClick: PropTypes.func,
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
    <NotificationsVerifyBox
      success
      header="Awaiting verification. Please check your email!"
    >
      <div>
        We’ve sent an email to <strong>{email}</strong>. Verify your email
        address so you can manage your notifications subscriptions.
      </div>
      <Button
        css={`
          margin-top: ${GU}px;
        `}
        onClick={handleResetEmail}
        label="Logout"
      />
    </NotificationsVerifyBox>
  )
}
NotificationsPreVerify.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
}
