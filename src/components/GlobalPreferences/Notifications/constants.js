export const NOTIFICATION_SERVICE_EMAIL_KEY = 'NOTIFICATION_SERVICE_EMAIL_KEY'
export const NOTIFICATION_SERVICE_TOKEN_KEY = 'NOTIFICATION_SERVICE_TOKEN_KEY'
export const VERIFY_SUBSECTION = '/verify/'

// A user can be in one of these three states
// Only once the user is verified (authenticated) can he create subscriptions
export const AUTH_UNAUTHENTICATED = 'AUTH_UNAUTHENTICATED'
export const AUTH_PREVERIFY = 'AUTH_PREVERIFY' // submitted email but didn't verify
export const AUTH_AUTHENTICATED = 'AUTH_AUTHENTICATED'
