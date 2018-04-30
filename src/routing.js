import { isAddress } from 'web3-utils'

export const staticApps = new Map(
  Object.entries({
    home: '/',
    settings: '/settings',
    permissions: '/permissions',
  })
)

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
 * /{dao_address}/0x{app_instance_address}?params={app_params}
 *
 *
 * Available modes:
 *   - home: the screen you see when opening /.
 *   - setup: the onboarding screens.
 *   - app: when the path starts with a DAO address.
 *   - unknown: the mode can’t be determined.
 */
export const parsePath = (pathname, search = '') => {
  const locator = { path: pathname + search }
  const [, ...parts] = locator.path.split('/')

  // Home
  if (!parts[0]) {
    return { ...locator, mode: 'home' }
  }

  // Setup
  if (parts[0] === 'setup') {
    const [mode, step = null, ...setupParts] = parts
    return { ...locator, mode, step, parts: setupParts }
  }

  const validAddress = isAddress(parts[0])
  const validDomain = /[a-z0-9]+\.aragonid\.eth/.test(parts[0])

  // Exclude invalid DAO addresses
  if (!validAddress && !validDomain) {
    return { ...locator, mode: 'unknown' }
  }

  // App
  const rawParams = search && search.split('?params=')[1]
  const params = rawParams ? JSON.parse(decodeURIComponent(rawParams)) : null
  const [dao, proxyAddress, ...appParts] = parts
  return {
    ...locator,
    mode: 'app',
    dao,
    proxyAddress: proxyAddress || 'home',
    params,
    parts: appParts,
  }
}

// Return a path string for an app instance
export const getAppPath = ({ dao, proxyAddress = 'home', params } = {}) => {
  if (staticApps.has(proxyAddress)) {
    return `/${dao}${staticApps.get(proxyAddress)}`
  }
  return `/${dao}/${proxyAddress}${
    params ? `?params=${encodeURIComponent(JSON.stringify(params))}` : ``
  }`
}
