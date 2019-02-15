import resolvePathname from 'resolve-pathname'
import Web3 from 'web3'

// Stealing this from recompose / etc for now
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// Get the icon URL of an app
export function appIconUrl(app) {
  return app && app.baseUrl
    ? resolvePathname('images/icon.svg', app.baseUrl)
    : null
}

export function isElectron() {
  // See https://github.com/electron/electron/issues/2288
  return (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  )
}

export function noop() {}

export function removeStartingSlash(str) {
  return str.replace(/^\/+/, '')
}

// Append a trailing slash if needed
export function appendTrailingSlash(str) {
  return str + (str.endsWith('/') ? '' : '/')
}

export function log(...params) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params)
  }
}

export async function isValidNode(uri) {
  try {
    const web3 = new Web3(uri)
    const connected = await web3.eth.net.isListening()
    web3.currentProvider.connection.close()

    return connected
  } catch (err) {
    return false
  }
}
