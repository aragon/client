// List of configurable settings
const APP_LOCATOR = 'APP_LOCATOR'
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const ETH_SUBSCRIPTION_EVENT_DELAY = 'ETH_SUBSCRIPTION_EVENT_DELAY'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const SELECTED_CURRENCY = 'SELECTED_CURRENCY'
const SENTRY_DSN = 'SENTRY_DSN'
const PACKAGE_VERSION = 'PACKAGE_VERSION'

// Parcel requires env vars to be declared statically.
const CONFIGURATION_VARS = [
  [
    APP_LOCATOR,
    process.env.ARAGON_APP_LOCATOR,
    process.env.REACT_APP_ASSET_BRIDGE,
  ],
  [
    DEFAULT_ETH_NODE,
    process.env.ARAGON_DEFAULT_ETH_NODE,
    process.env.REACT_APP_DEFAULT_ETH_NODE,
  ],
  [
    ENS_REGISTRY_ADDRESS,
    process.env.ARAGON_ENS_REGISTRY_ADDRESS,
    process.env.REACT_APP_ENS_REGISTRY_ADDRESS,
  ],
  [
    ETH_NETWORK_TYPE,
    process.env.ARAGON_ETH_NETWORK_TYPE,
    process.env.REACT_APP_ETH_NETWORK_TYPE,
  ],
  [
    ETH_SUBSCRIPTION_EVENT_DELAY,
    process.env.ARAGON_ETH_SUBSCRIPTION_EVENT_DELAY,
    process.env.REACT_APP_ETH_SUBSCRIPTION_EVENT_DELAY,
  ],
  [
    IPFS_GATEWAY,
    process.env.ARAGON_IPFS_GATEWAY,
    process.env.REACT_APP_IPFS_GATEWAY,
  ],
  [
    SELECTED_CURRENCY,
    process.env.ARAGON_SELECTED_CURRENCY,
    process.env.REACT_APP_SELECTED_CURRENCY,
  ],
  [SENTRY_DSN, process.env.ARAGON_SENTRY_DSN, process.env.REACT_APP_SENTRY_DSN],
  [
    PACKAGE_VERSION,
    process.env.ARAGON_PACKAGE_VERSION,
    process.env.REACT_APP_PACKAGE_VERSION,
  ],
].reduce(
  (acc, [option, envValue, envValueCompat]) => ({
    ...acc,
    [option]: {
      storageKey: `${option}_KEY`,
      envValue: envValue || envValueCompat || null,
    },
  }),
  {}
)

// Get a setting from localStorage
function getLocalStorageSetting(confKey) {
  return window.localStorage.getItem(CONFIGURATION_VARS[confKey].storageKey)
}

// Get a setting from the env vars
function getEnvSetting(confKey) {
  return CONFIGURATION_VARS[confKey].envValue
}

// Get a local setting: from the local storage if available, or the env vars.
function getLocalSetting(confKey) {
  return getLocalStorageSetting(confKey) || getEnvSetting(confKey)
}

function setLocalSetting(confKey, value) {
  const confVar = CONFIGURATION_VARS[confKey]
  return window.localStorage.setItem(confVar.storageKey, value)
}

export function getAppLocator() {
  return getLocalSetting(APP_LOCATOR) || ''
}

export function getDefaultEthNode() {
  // Let the network configuration handle node defaults
  return getLocalSetting(DEFAULT_ETH_NODE) || ''
}

export function setDefaultEthNode(node) {
  return setLocalSetting(DEFAULT_ETH_NODE, node)
}

export function getEnsRegistryAddress() {
  // Let the network configuration handle contract address defaults
  return getLocalSetting(ENS_REGISTRY_ADDRESS) || ''
}

export function getEthNetworkType() {
  return getLocalSetting(ETH_NETWORK_TYPE) || 'rinkeby'
}

export function getEthSubscriptionEventDelay() {
  return getLocalSetting(ETH_SUBSCRIPTION_EVENT_DELAY) || 0
}

export function getIpfsGateway() {
  return getLocalSetting(IPFS_GATEWAY) || 'https://ipfs.eth.aragon.network/ipfs'
}

export function setIpfsGateway(gateway) {
  return setLocalSetting(IPFS_GATEWAY, gateway)
}

export function getSelectedCurrency() {
  return (getLocalSetting(SELECTED_CURRENCY) || 'USD').toUpperCase()
}

export function setSelectedCurrency(currency) {
  return setLocalSetting(SELECTED_CURRENCY, currency.toUpperCase())
}

export function getSentryDsn() {
  return getLocalSetting(SENTRY_DSN) || ''
}

// The previous package version is stored in localStorage,
// while the current one is coming from the environment.
export function getPackageVersion() {
  return getEnvSetting(PACKAGE_VERSION) || ''
}

export function getLastPackageVersion() {
  return getLocalStorageSetting(PACKAGE_VERSION) || ''
}

export function setPackageVersion(version, purge) {
  return setLocalSetting(PACKAGE_VERSION, version)
}
