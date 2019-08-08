import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, GU, Info, LoadingRing, Text } from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import { VERIFY_SUBSECTION } from './constants'
import checkmarkSvg from './check-mark.svg'

export default function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)
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
        <LoadingRing />
      </Box>
    )
  }

  if (verified) {
    return (
      <Box heading="Email notifications">
        <div>
          <Checkmark />
          <Text>Verification successful</Text>
          <Text size="xsmall">
            Your email was verified and now you can subscribe to app events to
            receive email notifications.{' '}
            <Button onClick={navigateToNotifications}>
              Go to Notification preferences.
            </Button>
          </Text>
        </div>
      </Box>
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

const Checkmark = () => (
  <img
    src={checkmarkSvg}
    alt="check mark"
    css={`
      display: inline block;
      margin: ${1 * GU}px auto;
    `}
  />
)

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
  onEmailChange: PropTypes.func,
  navigateToNotifications: PropTypes.func,
}
