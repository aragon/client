import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  ButtonBase,
  GU,
  Info,
  LoadingRing,
  Text,
  RADIUS,
  useTheme,
  textStyle,
} from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import { VERIFY_SUBSECTION } from './constants'
import checkmarkSvg from './check-mark.svg'
import notificationSvg from './notifications.svg'

export function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    // Parse token from subsection /verify/TOKEN -> TOKEN
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        onTokenChange(longLivedToken)
        setVerified(true)
        return longLivedToken
      })
      .catch(e => {
        // if an invalid token is passed. Clear email and token to reset state
        setVerified(false)
        setError(e.message)
        onEmailChange(null)
        onTokenChange(null)
      })
  }, [subsection, onTokenChange, onEmailChange])

  if (!verified && !error) {
    return (
      <Box heading="Email notifications">
        <div
          css={`
            display: flex;
            justify-content: center;
          `}
        >
          <LoadingRing />
        </div>
      </Box>
    )
  }

  if (verified) {
    return (
      <NotificationsVerifyBox header="Verification successful">
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
  if (error) {
    return (
      <Box heading="Email notifications">
        <div>
          <Text>Verification failed</Text>
          <br />
          <Info mode="error">Error verifying: {error}</Info>
        </div>
      </Box>
    )
  }
}

export function NotificationsPreVerify({ email }) {
  return (
    <NotificationsVerifyBox header="Awaiting verification. Please check your email!">
      <div>
        We’ve sent an email to <span css="font-weight: bold;">{email}</span>.
        Verify your email address so you can manage your notifications
        subscriptions.
      </div>
    </NotificationsVerifyBox>
  )
}

export function NotificationsVerifyBox({ header, children }) {
  const theme = useTheme()

  return (
    <Box heading="Email notifications">
      <NotificationImage />
      <div
        css={`
          background: ${theme.feedbackSurface};
          display: grid;
          border-radius: ${RADIUS}px;
          padding: ${3.5 * GU}px ${10 * GU}px;
          grid-gap: ${2 * GU}px;
          grid-template-columns: auto 1fr;
          align-items: center;
        `}
      >
        <Checkmark />
        <div>
          <div
            css={`
              margin-bottom: ${2 * GU}px;
              ${textStyle('body1')};
            `}
          >
            <div>{header}</div>
          </div>
          <div
            css={`
              ${textStyle('body2')};
              color: ${theme.feedbackSurfaceContentSecondary};
            `}
          >
            {children}
          </div>
        </div>
      </div>
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

const Checkmark = () => <img src={checkmarkSvg} alt="check mark" />

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
  onEmailChange: PropTypes.func,
  navigateToNotifications: PropTypes.func,
}
