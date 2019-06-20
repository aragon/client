import { staticApps } from './static-apps'
import { APP_MODE_START, APP_MODE_ORG, APP_MODE_SETUP } from './symbols'

import { isAddress, isValidEnsName } from './web3-utils'

export const ARAGONID_ENS_DOMAIN = 'aragonid.eth'

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
export const parsePath = (pathname, search = '') => {
  const path = pathname + search
  const [, ...parts] = pathname.split('/')
  const base = { path, pathname, search }

  // Start
  if (!parts[0]) {
    return { ...base, mode: APP_MODE_START }
  }

  // Setup
  if (parts[0] === 'setup') {
    const [, step = null, ...setupParts] = parts
    return { ...base, mode: APP_MODE_SETUP, step, parts: setupParts }
  }

  let [dao] = parts
  const validAddress = isAddress(dao)
  const validDomain = isValidEnsName(dao)

  // Assume .aragonid.eth if not given a valid address or a valid ENS domain
  if (!validAddress && !validDomain) {
    dao += `.${ARAGONID_ENS_DOMAIN}`
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

  const [, instanceId, ...instancePathParts] = parts

  // The local path of an app (internal or external)
  const instancePath = `/${
    instancePathParts ? instancePathParts.join('/') : ''
  }`

  const completeLocator = {
    ...base,
    mode: APP_MODE_ORG,
    dao,
    instanceId: instanceId || 'home',
    params,
    instancePath,
  }

  return completeLocator
}

function encodePath(path) {
  return path
    .split('/')
    .map(v => encodeURIComponent(v))
    .join('/')
}

// Return a path string for an app instance
export const getAppPath = ({
  dao,
  instanceId = 'home',
  instancePath = '/',
} = {}) => {
  // Always start with /
  if (!instancePath.startsWith('/')) {
    instancePath = `/${instancePath}`
  }

  if (dao.endsWith(ARAGONID_ENS_DOMAIN)) {
    dao = dao.replace(/\.aragonid\.eth$/, '')
  }

  if (staticApps.has(instanceId)) {
    return `/${dao}${staticApps.get(instanceId).route}${encodePath(
      instancePath
    )}`
  }

  return `/${dao}/${instanceId}${encodePath(instancePath)}`
}
