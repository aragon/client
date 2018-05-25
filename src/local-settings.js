// List of configurable settings
const ASSET_BRIDGE = 'ASSET_BRIDGE'
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const IPFS_RPC = 'IPFS_RPC'

const CONFIGURATION_KEYS = [
  ASSET_BRIDGE,
  DEFAULT_ETH_NODE,
  ENS_REGISTRY_ADDRESS,
  ETH_NETWORK_TYPE,
  IPFS_GATEWAY,
  IPFS_RPC,
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
  return getLocalSetting(DEFAULT_ETH_NODE, 'ws://rinkeby.aragon.network:8546')
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
  return getLocalSetting(IPFS_GATEWAY, 'https://gateway.ipfs.io/ipfs')
}

export function setIpfsGateway(gateway) {
  return setLocalSetting(IPFS_GATEWAY, gateway)
}

export function getIpfsRpc() {
  const rpc = getLocalSetting(IPFS_RPC, '')

  try {
    const url = new URL(rpc)
    return {
      host: url.hostname,
      port: url.port,
      // The URL.protocol includes the final :, but ipfs-js doesn't like that so we trim it off
      protocol: url.protocol.slice(0, -1),
    }
  } catch (err) {
    if (rpc && process.env.NODE_ENV !== 'production') {
      console.error(
        `The provided IPFS RPC url (${rpc}) in the environment is incorrectly formatted.`,
        "The url must contain at least '<protocol>://<host>:<port>'."
      )
      console.log('Defaulting back to Infura for the IPFS RPC node...')
    }
    return {
      host: 'ipfs.infura.io',
      port: '5001',
      protocol: 'https',
    }
  }
}
