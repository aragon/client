import finance from './apps/finance'
import voting from './apps/voting'
import tokenManager from './apps/token-manager'
import survey from './apps/survey'

export const KnownApps = new Map([finance, voting, tokenManager, survey])

export const getKnownApp = appName => KnownApps.get(appName) || null
