import { staticApps } from './static-apps'
import { APP_MODE_START, APP_MODE_ORG, APP_MODE_SETUP } from './symbols'
import { isAddress, isValidEnsName } from './web3-utils'

const ARAGONID_ENS_DOMAIN = 'aragonid.eth'

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
 * /{dao_address}/0x{app_instance_address}?p={app_params}
 *
 *
 * Available modes:
 *   - start: the screen you see when opening /.
 *   - setup: the onboarding screens.
 *   - org: when the path starts with a DAO address.
 *   - invalid: the DAO given is not valid
 */
export function parsePath(history, pathname, search = '') {
  const path = pathname + search
  const [, ...parts] = pathname.split('/')

  // Onboarding
  if (!parts[0] || parts[0] === 'open' || parts[0] === 'create') {
    return {
      path,
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
  } else if (validDomain && dao.endsWith(ARAGONID_ENS_DOMAIN)) {
    // Replace URL with non-aragonid.eth version
    history.replace({
      pathname: pathname.replace(`.${ARAGONID_ENS_DOMAIN}`, ''),
      search,
      state: {
        alreadyParsed: true,
      },
    })
  }

  // Organization
  const rawParams = search && search.split('?p=')[1]
  let params = null
  if (rawParams) {
    try {
      params = decodeURIComponent(rawParams)
    } catch (err) {
      console.log('The params (“p”) URL parameter is not valid.')
    }
  }

  const [, instanceId, ...appParts] = parts

  const completeLocator = {
    path,
    mode: APP_MODE_ORG,
    dao,
    instanceId: instanceId || 'home',
    params,
    parts: appParts,
    localPath: appParts.length ? `/${appParts.join('/')}` : '',
    preferences: parsePreferences(search),
  }

  return completeLocator
}

// Return a path string from a locator object.
export function getAppPath({
  dao: fullDao,
  instanceId = 'home',
  localPath = '',
  params,
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

  if (!fullDao) {
    return `/${search}`
  }

  const dao =
    fullDao.indexOf(ARAGONID_ENS_DOMAIN) > -1
      ? fullDao.substr(0, fullDao.indexOf(ARAGONID_ENS_DOMAIN) - 1)
      : fullDao

  // The search takes priority over app params for now. App params are going to
  // be replaced soon so it shouldn’t be an issue.
  if (!search && params) {
    search = `?p=${encodeURIComponent(params)}`
  }

  if (staticApps.has(instanceId)) {
    return '/' + dao + staticApps.get(instanceId).route + localPath + search
  }

  return `/${dao}/${instanceId}${search}`
}

// Preferences
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences=/'
const GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR = '&labels='

function parsePreferences(search = '') {
  const [, raw = ''] = search.split(GLOBAL_PREFERENCES_QUERY_PARAM)
  const params = new Map()
  const [path = null, labels = null] = raw.split(
    GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR
  )
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

export function useRouterArgs(location) {
  const args = location.hash.split('/')
  const setArgs = args => history.pushState(null, null, '#/' + args.join('/'))
  return [args, setArgs]
}
