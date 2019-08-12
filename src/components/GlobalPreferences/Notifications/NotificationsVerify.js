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
import {
  VERIFY_SUBSECTION,
  UnauthroizedError,
  ExpiredTokenError,
} from './constants'
import checkmarkSvg from './check-mark.svg'
import notificationSvg from './notifications.svg'

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

  useEffect(() => {
    // Parse token from subsection /verify/[TOKEN] -> [TOKEN]
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        setIsFetching(false)
        setVerified(true)
        onTokenChange(longLivedToken)
        return longLivedToken
      })
      .catch(e => {
        // if an invalid token is passed. we can clear email and token to reset the stae 
        // or present the user with the error and give some options
        // onEmailChange(null)
        // onTokenChange(null)

        if (e instanceof ExpiredTokenError) {
          setError('Your email link has expired.')
        } else if (e instanceof UnauthroizedError) {
          setError('Unauthroized')
        }
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
  if (error) {
    return (
      <NotificationsVerifyBox header="Verification Failed">
        <div>
          <Info mode="error">{error}</Info>
        </div>
      </NotificationsVerifyBox>
    )
  }

  return <NotificationsVerifyBox header="Verification" />
}

export function NotificationsPreVerify({ email }) {
  return (
    <NotificationsVerifyBox
      success
      header="Awaiting verification. Please check your email!"
    >
      <div>
        We’ve sent an email to <span css="font-weight: bold;">{email}</span>.
        Verify your email address so you can manage your notifications
        subscriptions.
      </div>
    </NotificationsVerifyBox>
  )
}

export function NotificationsVerifyBox({ header, children, success }) {
  const theme = useTheme()

  return (
    <Box heading="Email notifications">
      <NotificationImage />
      <div
        css={`
          height: ${GU * 20}px;
          background: ${theme.feedbackSurface};
          display: grid;
          border-radius: ${RADIUS}px;
          padding: ${3.5 * GU}px ${10 * GU}px;
          grid-gap: ${2 * GU}px;
          grid-template-columns: auto 1fr;
          align-items: center;
        `}
      >
        {success && <Checkmark />}
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
