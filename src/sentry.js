import * as Sentry from '@sentry/browser'
import { network } from './environment'
import { getPackageVersion, getSentryDsn } from './local-settings'
import { log } from './utils'

const packageVersion = getPackageVersion()
const sentryDsn = getSentryDsn()

export const isSentryEnabled = !!sentryDsn

export function logWithSentry(message, level = 'warning') {
  log(message)
  if (sentryDsn) {
    Sentry.captureMessage(message, level)
  }
}

export default function initializeSentryIfEnabled() {
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      release: packageVersion,
      environment: network.shortName,
    })
  }
}
