// List of configurable settings
const APP_LOCATOR = 'APP_LOCATOR'
const CLIENT_THEME = 'THEME'
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const ETH_SUBSCRIPTION_EVENT_DELAY = 'ETH_SUBSCRIPTION_EVENT_DELAY'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const LOCAL_CHAIN_ID = 'LOCAL_CHAIN_ID'
const PACKAGE_VERSION = 'PACKAGE_VERSION'
const SELECTED_CURRENCY = 'SELECTED_CURRENCY'
const PORTIS_DAPP_ID = 'PORTIS_DAPP_ID'
const FORTMATIC_API_KEY = 'FORTMATIC_API_KEY'

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
  [
    PACKAGE_VERSION,
    process.env.ARAGON_PACKAGE_VERSION,
    process.env.REACT_APP_PACKAGE_VERSION,
  ],
  [CLIENT_THEME, process.env.ARAGON_CLIENT_THEME],
  [LOCAL_CHAIN_ID, process.env.LOCAL_CHAIN_ID],
  [FORTMATIC_API_KEY, process.env.ARAGON_FORTMATIC_API_KEY],
  [PORTIS_DAPP_ID, process.env.ARAGON_PORTIS_DAPP_ID],
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

function toStorageKey(key, networkType) {
  return networkType ? `${networkType}:${key}` : key
}

// Get a setting from localStorage
function getLocalStorageSetting(confKey, networkType) {
  const key = CONFIGURATION_VARS[confKey].storageKey
  const storageKey = toStorageKey(key, networkType)
  return window.localStorage.getItem(storageKey)
}

// Get a setting from the env vars
function getEnvSetting(confKey) {
  return CONFIGURATION_VARS[confKey].envValue
}

// Get a local setting: from the local storage if available, or the env vars.
function getLocalSetting(confKey, networkType) {
  return getLocalStorageSetting(confKey, networkType) || getEnvSetting(confKey)
}

function setLocalSetting(confKey, value, networkType) {
  const confVar = CONFIGURATION_VARS[confKey]
  const key = toStorageKey(confVar.storageKey, networkType)
  return window.localStorage.setItem(key, value)
}

export function getAppLocator(networkType) {
  return getLocalSetting(APP_LOCATOR, networkType) || ''
}

export function getLocalChainId() {
  // Default to 1337 as used by most local development environments.
  return getLocalSetting(LOCAL_CHAIN_ID) || 1337
}

export function getDefaultEthNode(networkType) {
  return getLocalSetting(DEFAULT_ETH_NODE, networkType) || ''
}

export function setDefaultEthNode(node, networkType) {
  return setLocalSetting(DEFAULT_ETH_NODE, node, networkType)
}

export function getEnsRegistryAddress() {
  // Let the network configuration handle contract address defaults
  return getLocalSetting(ENS_REGISTRY_ADDRESS) || ''
}

export function getEthSubscriptionEventDelay() {
  const delay = parseInt(getLocalSetting(ETH_SUBSCRIPTION_EVENT_DELAY), 10)
  return Number.isFinite(delay) ? delay : 0
}

export function getIpfsGateway() {
  return getLocalSetting(IPFS_GATEWAY) || 'https://ipfs.eth.aragon.network/ipfs'
}

export function setIpfsGateway(gateway, networkType) {
  return setLocalSetting(IPFS_GATEWAY, gateway, networkType)
}

export function getSelectedCurrency() {
  return (getLocalSetting(SELECTED_CURRENCY) || 'USD').toUpperCase()
}

export function setSelectedCurrency(currency) {
  return setLocalSetting(SELECTED_CURRENCY, currency.toUpperCase())
}

// The previous package version is stored in localStorage,
// while the current one is coming from the environment.
export function getPackageVersion() {
  return getEnvSetting(PACKAGE_VERSION) || ''
}

export function getLastPackageVersion() {
  return getLocalStorageSetting(PACKAGE_VERSION) || ''
}

export function setPackageVersion(version) {
  return setLocalSetting(PACKAGE_VERSION, version)
}

export function getClientTheme() {
  const storedClientTheme = getLocalStorageSetting(CLIENT_THEME)
  if (storedClientTheme) {
    try {
      return JSON.parse(storedClientTheme)
    } catch (err) {}
  }
  return {
    // To be replaced by an “auto” state
    appearance: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    theme: null,
  }
}

export function setClientTheme(appearance, theme = null) {
  return setLocalSetting(CLIENT_THEME, JSON.stringify({ appearance, theme }))
}

export function getPortisDappId() {
  return getLocalSetting(PORTIS_DAPP_ID) || ''
}

export function getFortmaticApiKey() {
  return getLocalSetting(FORTMATIC_API_KEY) || ''
}
