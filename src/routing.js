import { staticApps } from './static-apps'
import {
  APP_MODE_START,
  APP_MODE_ORG,
  APP_MODE_SETUP,
  APP_MODE_INVALID,
} from './symbols'

import { isAddress, isValidEnsName } from './web3-utils'

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

  // Start
  if (!parts[0]) {
    return { path, mode: APP_MODE_START }
  }

  // Setup
  if (parts[0] === 'setup') {
    const [, step = null, ...setupParts] = parts
    return { path, mode: APP_MODE_SETUP, step, parts: setupParts }
  }

  const validAddress = isAddress(parts[0])
  const validDomain = isValidEnsName(parts[0])

  // Exclude invalid DAO addresses
  if (!validAddress && !validDomain) {
    return { path, dao: parts[0], mode: APP_MODE_INVALID }
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

  const [dao, instanceId, ...appParts] = parts

  const completeLocator = {
    path,
    mode: APP_MODE_ORG,
    dao,
    instanceId: instanceId || 'home',
    params,
    parts: appParts,
  }

  return completeLocator
}

// Return a path string for an app instance
export const getAppPath = ({ dao, instanceId = 'home', params } = {}) => {
  const paramsPart = params ? `?p=${encodeURIComponent(params)}` : ``
  if (staticApps.has(instanceId)) {
    return `/${dao}${staticApps.get(instanceId).route}${paramsPart}`
  }
  return `/${dao}/${instanceId}${paramsPart}`
}
