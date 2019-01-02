import resolvePathname from 'resolve-pathname'

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

export function makeEtherscanBaseUrl(network) {
  // Don't make etherscan urls if the network isn't one that etherscan supports
  if (
    network === 'main' ||
    network === 'kovan' ||
    network === 'rinkeby' ||
    network === 'ropsten'
  ) {
    return `https://${network === 'main' ? '' : `${network}.`}etherscan.io`
  }
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

export function isSmallScreen() {
  return window.innerWidth < 768
}
