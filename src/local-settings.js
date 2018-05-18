// List of configurable settings
const DEFAULT_ETH_NODE = 'DEFAULT_ETH_NODE'
const ENS_REGISTRY_ADDRESS = 'ENS_REGISTRY_ADDRESS'
const ETH_NETWORK_TYPE = 'ETH_NETWORK_TYPE'
const IPFS_GATEWAY = 'IPFS_GATEWAY'
const IPFS_RPC = 'IPFS_RPC'

const CONFIGURATION_KEYS = [
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

export function getDefaultEthNode() {
  const keys = CONFIGURATION_KEYS[DEFAULT_ETH_NODE]
  return (
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    'ws://rinkeby.aragon.network:8546'
  )
}

export function setDefaultEthNode(node) {
  const keys = CONFIGURATION_KEYS[DEFAULT_ETH_NODE]
  return window.localStorage.setItem(keys.storageKey, node)
}

export function getEnsRegistryAddress() {
  const keys = CONFIGURATION_KEYS[ENS_REGISTRY_ADDRESS]
  return (
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    '' // Let the network configuration handle contract address defaults
  )
}

export function getEthNetworkType() {
  const keys = CONFIGURATION_KEYS[ETH_NETWORK_TYPE]
  return (
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    'rinkeby'
  )
}

export function getIpfsGateway() {
  const keys = CONFIGURATION_KEYS[IPFS_GATEWAY]
  return (
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    'https://gateway.ipfs.io/ipfs'
  )
}

export function setIpfsGateway(gateway) {
  const keys = CONFIGURATION_KEYS[IPFS_GATEWAY]
  return window.localStorage.setItem(keys.storageKey, gateway)
}

export function getIpfsRpc() {
  const keys = CONFIGURATION_KEYS[IPFS_RPC]
  const rpc =
    window.localStorage.getItem(keys.storageKey) ||
    process.env[keys.environmentKey] ||
    ''

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
