import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { verifyEmailToken } from './notification-service-api'
import { VERIFY_SUBSECTION } from './constants'

export default function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  useEffect(() => {
    // Parse token from subsection /verify/TOKEN -> TOKEN
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        onTokenChange(longLivedToken)
        navigateToNotifications()
        return longLivedToken
      })
      .catch(e => {
        // if an invalid token is passed. Clear email and token to reset state
        onEmailChange(null)
        onTokenChange(null)
        navigateToNotifications()
      })
  }, [subsection, onTokenChange, navigateToNotifications, onEmailChange])
}

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
  onEmailChange: PropTypes.func,
  navigateToNotifications: PropTypes.func,
}
