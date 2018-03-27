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

export function makeEtherscanBaseUrl(network) {
  // Don't make etherscan urls if the network isn't one that etherscan supports
  if (
    network === 'mainnet' ||
    network === 'kovan' ||
    network === 'rinkeby' ||
    network === 'ropsten'
  ) {
    return `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io`
  }
}

export function noop() {}

export function removeTrailingSlash(str) {
  return str.replace(/\/+$/, '')
}

export function log(...params) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params)
  }
}
