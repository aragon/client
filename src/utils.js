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
  return `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io`
}

export function noop() {}

export function removeTrailingSlash(str) {
  return str.replace(/\/+$/, '')
}
