import { chains } from 'use-wallet'
import { getNetworkConfig, networkConfigs } from '../network-config'

export const isActiveNetwork = networkType => {
  return getNetworkConfig(networkType).isActive
}

export const getActiveNetworks = () => {
  return Object.values(networkConfigs)
    .filter(v => v.isActive)
    .map(n => n.settings.type)
}

export const getOptions = networkType => {
  return getNetworkConfig(networkType).settings?.options
}

export function isOnEthMainnet(networkType) {
  return networkType === chains.getChainInformation(1).type
}

export function isMainnet(networkType) {
  return !getNetworkConfig(networkType).settings?.testnet
}

export function isTestnet(networkType) {
  return getNetworkConfig(networkType).settings?.testnet
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

export function getNetworkFullName(networkType) {
  return getNetworkConfig(networkType).settings?.fullName || 'uknown'
}
export function getNetworkShortName(networkType) {
  return getNetworkConfig(networkType).settings?.shortName || 'uknown'
}

export function getNetworkSettings(networkType) {
  return getNetworkConfig(networkType).settings
}

export function getChainId(networkType) {
  return getNetworkSettings(networkType).chainId
}
