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
 * /setup/template
 * /setup/domain
 * /setup/configure/1
 * /setup/configure/2
 * /setup/registering
 *
 * App:
 *
 * Note: a dao_address can be either of the form /0xcafe… or abc.aragonid.eth
 *
 * /{dao_address}
 * /{dao_address}/settings
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
export const parsePath = (history, pathname, search = '') => {
  const path = pathname + search
  const [, ...parts] = pathname.split('/')

  // Start
  if (!parts[0]) {
    return { path, mode: APP_MODE_START }
  }

  // Setup
  if (parts[0] === 'setup') {
    const [, step = null, ...setupParts] = parts
    return { path, mode: APP_MODE_SETUP, step, parts: setupParts }
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
    localPath: appParts.join('/'),
    preferences: parsePreferences(search),
  }

  return completeLocator
}

// Return a path string for an app instance
export function getAppPath({
  dao: fullDao,
  instanceId = 'home',
  localPath = '',
  params,
} = {}) {
  const dao =
    fullDao.indexOf(ARAGONID_ENS_DOMAIN) > -1
      ? fullDao.substr(0, fullDao.indexOf(ARAGONID_ENS_DOMAIN) - 1)
      : fullDao

  const paramsPart = params ? `?p=${encodeURIComponent(params)}` : ``

  if (staticApps.has(instanceId)) {
    return '/' + dao + staticApps.get(instanceId).route + localPath + paramsPart
  }

  return `/${dao}/${instanceId}${paramsPart}`
}

// Preferences
export const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences=/'
export const GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR = '&labels='

const parsePreferences = search => {
  const [, raw = ''] = search && search.split(GLOBAL_PREFERENCES_QUERY_PARAM)
  const params = new Map()
  const [path = null, labels = null] = raw.split(
    GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR
  )
  if (labels) {
    params.set(GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR, labels)
  }
  return { path, params }
}
