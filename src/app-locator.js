import { hash as namehash } from 'eth-ens-namehash'
import appIds from './known-app-ids'
import { appendTrailingSlash } from './util/utils'

// Known apps and their assigned ports
const DEFAULT_LOCAL_URLS = {
  [appIds['Voting']]: 'http://localhost:3001/',
  [appIds['Finance']]: 'http://localhost:3002/',
  [appIds['TokenManager']]: 'http://localhost:3003/',
  [appIds['Survey']]: 'http://localhost:3004/',
  [appIds['Agent']]: 'http://localhost:3005/',
  [appIds['Fundraising']]: 'http://localhost:3006/',
}

// Split a single bridge declaration into an app + a location
function splitBridge(bridge) {
  const firstColon = bridge.indexOf(':')
  if (firstColon === -1) {
    return [bridge]
  }
  return [
    bridge.slice(0, firstColon).trim(),
    bridge.slice(firstColon + 1).trim(),
  ]
}

function getAppId(app) {
  // known app name
  if (appIds[app]) {
    return appIds[app]
  }

  // ENS app ID
  if (app.endsWith('.aragonpm.eth')) {
    return namehash(app)
  }

  // probably a valid app ID
  if (app.startsWith('0x') && app.length === 66) {
    return app
  }

  return null
}

function getAppUrl(appId, location = '') {
  // Probably a valid port, default to localhost.
  if (/^[0-9]+$/.test(location)) {
    return `http://localhost:${location}/`
  }

  // Get the default URL for this appId (when location=local).
  if (!location || location === 'local') {
    return DEFAULT_LOCAL_URLS[appId] || null
  }

  // Probably a valid HTTP URL.
  if (location.startsWith('http')) {
    return location
  }

  // Probably a domain or an IP.
  return `http://${
    location.includes('/') ? location : appendTrailingSlash(location)
  }`
}

// The app locator object can be used to know where to fetch an app from.
//
// It is generated from a bridge declaration that can look like one of these examples:
//
// "local": load all the known apps from localhost & their known ports.
// "Finance": load the finance app from localhost & its known port.
// "Finance:1234": load the finance app from localhost & the port 1234.
// "Finance,TokenManager": load the finance app and the Tokens app locally.
// "0x6b20…:3333": load the app with 0x6b20… ID from localhost & the 3333 port.
// "Voting:http://example.org:4444/": load the Voting app from example.org & the 4444 port.
//
export function parseAppLocator(appLocator) {
  if (!appLocator || appLocator === 'ipfs') {
    return {}
  }

  if (appLocator === 'local') {
    return DEFAULT_LOCAL_URLS
  }

  return appLocator.split(',').reduce((appLocator, bridge) => {
    const [app, location] = splitBridge(bridge)

    const appId = getAppId(app)

    // App not found or invalid app ID
    if (appId === null) {
      return appLocator
    }

    const appUrl = getAppUrl(appId, location)

    // App URL not found (invalid non-local location)
    if (appUrl === null) {
      return appLocator
    }

    // Update the app locator
    return { ...appLocator, [appId]: appUrl }
  }, {})
}
