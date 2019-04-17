import { appLocator, ipfsDefaultConf } from './environment'
import { appendTrailingSlash } from './utils'

function contentBaseUrl(content, gateway) {
  if (!content) {
    return ''
  }

  const { provider, location } = content
  if (provider === 'ipfs') {
    return `${gateway}/${location}/`
  }
  if (provider === 'http') {
    return /^https?:\/\//.test(location)
      ? appendTrailingSlash(location)
      : `http://${location}/`
  }
  return ''
}

/*
 * Supported locations:
 *   ipfs:{IPFS_HASH}
 *   http:{HOST}
 *   http:{HOST}:{PORT}
 *   http:{HOST}:{PORT}/{PATH}
 *   http:http(s)://{HOST}
 *   http:http(s)://{HOST}:{PORT}
 *   http:http(s)://{HOST}:{PORT}/{PATH}
 */
export function appBaseUrl(app, gateway = ipfsDefaultConf.gateway) {
  // Support overriding app URLs, see network-config.js
  if (appLocator[app.appId]) {
    return appLocator[app.appId]
  }

  return contentBaseUrl(app.content, gateway)
}

export function repoBaseUrl(repo, gateway = ipfsDefaultConf.gateway) {
  const { appId, latestVersion = {} } = repo

  // Support overriding app URLs, see network-config.js
  if (appLocator[appId]) {
    return appLocator[appId]
  }

  return contentBaseUrl(
    // The latest version's content is the artifact.json and manifest.json, so we need to
    // look up content again for the actual content location
    latestVersion.content && latestVersion.content.content,
    gateway
  )
}
