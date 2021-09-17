import { KNOWN_CHAINS } from 'use-wallet'
import { getNetworkConfig } from '../network-config'

export function isOnEthMainnet(networkType) {
  return networkType === KNOWN_CHAINS.get(1).type
}

export function isMainnet(networkType) {
  return (
    networkType === KNOWN_CHAINS.get(1).type ||
    networkType === KNOWN_CHAINS.get(137).type
  )
}

export function isTestnet(networkType) {
  return (
    networkType === KNOWN_CHAINS.get(4).type ||
    networkType === KNOWN_CHAINS.get(80001).type
  )
}

export function getDaiTokenAddress(networkType) {
  return getNetworkConfig(networkType).addresses.dai || ''
}

export function normalizeNetworkName(networkType) {
  return getNetworkConfig(networkType).settings?.shortName || 'unknown'
}

export function sanitizeNetworkType(networkType) {
  if (networkType === 'private') {
    return 'localhost'
  } else if (isOnEthMainnet(networkType)) {
    return 'mainnet'
  }
  return networkType
}

export function getNetworkName(networkType) {
  return getNetworkConfig(networkType).settings?.fullName || 'uknown'
}

export function getNetworkSettings(networkType) {
  return getNetworkConfig(networkType).settings
}

export function getChainId(networkType) {
  return getNetworkSettings(networkType).chainId
}
