// List of configurable settings
const ASSET_BRIDGE = 'ASSET_BRIDGE'
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const SELECTED_CURRENCY = 'SELECTED_CURRENCY'

const CONFIGURATION_KEYS = [
  ASSET_BRIDGE,
  DEFAULT_ETH_NODE,
  ENS_REGISTRY_ADDRESS,
  ETH_NETWORK_TYPE,
  IPFS_GATEWAY,
  SELECTED_CURRENCY,
].reduce(
  (acc, option) => ({
    ...acc,
    [option]: {
      storageKey: `${option}_KEY`,
      // REACT_APP_ prefix required for react-scripts
      environmentKey: `REACT_APP_${option}`,
    },
  }),
  {}
)

function getLocalSetting(confKey, settingDefault) {
  const keys = CONFIGURATION_KEYS[confKey]
  return (
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    settingDefault
  )
}

function setLocalSetting(confKey, setting) {
  const keys = CONFIGURATION_KEYS[confKey]
  return window.localStorage.setItem(keys.storageKey, setting)
}

export function getAssetBridge() {
  return getLocalSetting(ASSET_BRIDGE, '')
}

export function getDefaultEthNode() {
  // Let the network configuration handle node defaults
  return getLocalSetting(DEFAULT_ETH_NODE, '')
}

export function setDefaultEthNode(node) {
  return setLocalSetting(DEFAULT_ETH_NODE, node)
}

export function getEnsRegistryAddress() {
  return getLocalSetting(
    ENS_REGISTRY_ADDRESS,
    '' // Let the network configuration handle contract address defaults
  )
}

export function getEthNetworkType() {
  return getLocalSetting(ETH_NETWORK_TYPE, 'rinkeby')
}

export function getIpfsGateway() {
  return getLocalSetting(IPFS_GATEWAY, 'https://ipfs.infura.io/ipfs')
}

export function setIpfsGateway(gateway) {
  return setLocalSetting(IPFS_GATEWAY, gateway)
}

export function getSelectedCurrency() {
  return getLocalSetting(SELECTED_CURRENCY, 'USD').toUpperCase()
}

export function setSelectedCurrency(currency) {
  return setLocalSetting(SELECTED_CURRENCY, currency.toUpperCase())
}
