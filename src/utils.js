export function noop() {}

export function makeEtherscanBaseUrl(network) {
  return `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io`
}
