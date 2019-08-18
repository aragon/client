// List of configurable settings
const ASSET_BRIDGE = 'ASSET_BRIDGE'
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const ETH_SUBSCRIPTION_EVENT_DELAY = 'ETH_SUBSCRIPTION_EVENT_DELAY'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const SELECTED_CURRENCY = 'SELECTED_CURRENCY'
const SENTRY_DSN = 'SENTRY_DSN'

// process.env vars have to be declared statically (to be replaced by parcel).
const CONFIGURATION_VARS = [
  [ASSET_BRIDGE, process.env.REACT_APP_ASSET_BRIDGE],
  [DEFAULT_ETH_NODE, process.env.REACT_APP_DEFAULT_ETH_NODE],
  [ENS_REGISTRY_ADDRESS, process.env.REACT_APP_ENS_REGISTRY_ADDRESS],
  [ETH_NETWORK_TYPE, process.env.REACT_APP_ETH_NETWORK_TYPE],
  [
    ETH_SUBSCRIPTION_EVENT_DELAY,
    process.env.REACT_APP_ETH_SUBSCRIPTION_EVENT_DELAY,
  ],
  [IPFS_GATEWAY, process.env.REACT_APP_IPFS_GATEWAY],
  [SELECTED_CURRENCY, process.env.REACT_APP_SELECTED_CURRENCY],
  [SENTRY_DSN, process.env.REACT_APP_SENTRY_DSN],
].reduce(
  (acc, [option, envValue]) => ({
    ...acc,
    [option]: {
      storageKey: `${option}_KEY`,
      envValue: envValue || null,
    },
  }),
  {}
)

function getLocalSetting(confKey, settingDefault) {
  const confVar = CONFIGURATION_VARS[confKey]
  return (
    window.localStorage.getItem(confVar.storageKey) ||
    confVar.envValue ||
    settingDefault
  )
}

function setLocalSetting(confKey, setting) {
  const confVar = CONFIGURATION_VARS[confKey]
  return window.localStorage.setItem(confVar.storageKey, setting)
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

export function getEthSubscriptionEventDelay() {
  return getLocalSetting(ETH_SUBSCRIPTION_EVENT_DELAY, 0)
}

export function getIpfsGateway() {
  return getLocalSetting(IPFS_GATEWAY, 'https://ipfs.eth.aragon.network/ipfs')
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

export function getSentryDsn() {
  return getLocalSetting(SENTRY_DSN, '')
}
