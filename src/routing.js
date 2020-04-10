import { staticApps } from './static-apps'
import { APP_MODE_START, APP_MODE_ORG, APP_MODE_SETUP } from './symbols'
import { isAddress, isValidEnsName } from './web3-utils'
import { addStartingSlash } from './utils'

export const ARAGONID_ENS_DOMAIN = 'aragonid.eth'

function encodeAppPath(path) {
  return addStartingSlash(
    path
      .split('/')
      .map(v => encodeURIComponent(v))
      .join('/')
  )
}

function decodeAppPathParts(pathParts) {
  return pathParts.map(v => decodeURIComponent(v)).join('/')
}

/*
 * Parse a path and a search query and return a “locator” object.
 *
 * Paths examples:
 *
 * Onboarding:
 *
 * /
 * /open
 * /create
 *
 * App:
 *
 * Note: a dao_address can be either of the form /0xcafe… or abc.aragonid.eth
 *
 * /{dao_address}
 * /{dao_address}/permissions
 * /{dao_address}/0x{app_instance_address}
 *
 *
 * Available modes:
 *   - APP_MODE_START: the screen you see when opening /.
 *   - APP_MODE_SETUP: the onboarding screens.
 *   - APP_MODE_ORG: when the path starts with a DAO address or ENS name.
 */
export function parsePath(pathname, search = '') {
  const path = pathname + search
  const [, ...parts] = pathname.split('/')
  const base = { path, pathname, search }

  // Onboarding
  if (!parts[0] || parts[0] === 'open' || parts[0] === 'create') {
    return {
      ...base,
      mode: parts[0] === 'create' ? APP_MODE_SETUP : APP_MODE_START,
      action: parts[0],
      preferences: parsePreferences(search),
    }
  }

  let [dao] = parts
  const validAddress = isAddress(dao)
  const validDomain = isValidEnsName(dao)

  // Assume .aragonid.eth if not given a valid address or a valid ENS domain
  if (!validAddress && !validDomain) {
    dao += `.${ARAGONID_ENS_DOMAIN}`
  }

  const [, instanceId, ...instancePathParts] = parts

  // The local path of an app (internal or external)
  const instancePath = `/${
    instancePathParts ? decodeAppPathParts(instancePathParts) : ''
  }`

  return {
    ...base,
    dao,
    instanceId: instanceId || 'home',
    instancePath,
    mode: APP_MODE_ORG,
    preferences: parsePreferences(search),
  }
}

// Return a path string from a locator object.
export function getAppPath({
  dao,
  instanceId = 'home',
  instancePath = '',
  search = '',
  mode,
  action,
} = {}) {
  if (mode === APP_MODE_SETUP) {
    return '/create'
  }

  if (mode === APP_MODE_START) {
    return `/${action}`
  }

  // Only keep the DAO name if it ends in aragonid.eth
  if (dao.endsWith(ARAGONID_ENS_DOMAIN)) {
    dao = dao.substr(0, dao.indexOf(ARAGONID_ENS_DOMAIN) - 1)
  }

  if (!dao) {
    return `/${search}`
  }

  // Either the address of an app instance or the path of an internal app.
  const instancePart = staticApps.has(instanceId)
    ? staticApps.get(instanceId).route
    : `/${instanceId}`

  return '/' + dao + instancePart + encodeAppPath(instancePath) + search
}

// Preferences
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences='
const GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR = '&labels='

function parsePreferences(search = '') {
  const params = new Map()
  const searchParams = new URLSearchParams(search)

  const path = searchParams.get('preferences') || ''
  const labels = searchParams.get('labels')

  if (labels) {
    params.set('labels', labels)
  }
  return { path, params }
}

// For preferences, get the “search” part of the path (?=something)
// This function will probably be unified with parsePath() later.
export function getPreferencesSearch(screen, { labels } = {}) {
  let search = `${GLOBAL_PREFERENCES_QUERY_PARAM}${screen}`

  // For now `labels` is expected to be a string, but we might move the
  // conversion here at some point in the future.
  if (labels) {
    search += GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR + labels
  }

  return search
}
