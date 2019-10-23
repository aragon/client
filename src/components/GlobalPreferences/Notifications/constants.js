import { extendError } from '../../../errors'

const NOTIFICATION_SERVICE_URL = 'https://notifications.eth.aragon.network'
export const NOTIFICATION_SERVICE_ACCOUNT = `${NOTIFICATION_SERVICE_URL}/account`
export const NOTIFICATION_SERVICE_LOGIN = `${NOTIFICATION_SERVICE_URL}/login`
export const NOTIFICATION_SERVICE_VERIFY = `${NOTIFICATION_SERVICE_URL}/verify`
export const NOTIFICATION_SERVICE_SUBSCRIPTIONS = `${NOTIFICATION_SERVICE_URL}/subscriptions`

export const NOTIFICATION_SERVICE_HAS_LOGGED_OUT_KEY =
  'NOTIFICATION_SERVICE_HAS_LOGGED_OUT_KEY'
export const NOTIFICATION_SERVICE_EMAIL_KEY = 'NOTIFICATION_SERVICE_EMAIL_KEY'
export const NOTIFICATION_SERVICE_TOKEN_KEY = 'NOTIFICATION_SERVICE_TOKEN_KEY'
export const VERIFY_SUBSECTION = '/verify/'

// A user can be in one of these three states
// Only once the user is verified (authenticated) can he create subscriptions
export const AUTH_UNAUTHENTICATED = Symbol('AUTH_UNAUTHENTICATED')
export const AUTH_PREVERIFY = Symbol('AUTH_PREVERIFY') // submitted email but didn't verify
export const AUTH_AUTHENTICATING = Symbol('AUTH_AUTHENTICATING')
export const AUTH_SERVICE_UNAVAILABLE = Symbol('AUTH_SERVICE_UNAVAILABLE')
export const AUTH_AUTHENTICATED = Symbol('AUTH_AUTHENTICATED')
export const AUTH_AUTHENTICATION_FAILED = Symbol('AUTH_AUTHENTICATION_FAILED')

export const API_MESSAGE_EXPIRED_TOKEN = 'Expired token'

export const ExpiredTokenError = extendError('ExpiredToken', {
  defaultMessage: 'Notification Service API token has expired',
})

export const UnauthorizedError = extendError('UnauthorizedError', {
  defaultMessage: 'Notification Service API unauthorized',
})

export const SUCCESSFUL_VERIFICATION_REDIRECTION_DELAY = 10 * 1000

export const CREATE_SUBSCRIPTION_REQUIRED_KEYS = [
  'appName',
  'eventName',
  'contractAddress',
  'ensName',
  'network',
  'abi',
]
