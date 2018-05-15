const DEFAULT_ETH_NODE_KEY = 'ETH_NODE_KEY'
const ENS_REGISTRY_ADDRESS_KEY = 'ENS_REGISTRY_ADDRESS_KEY'
const ETH_NETWORK_TYPE_KEY = 'ETH_NETWORK_TYPE_KEY'
const IPFS_GATEWAY_KEY = 'IPFS_GATEWAY_KEY'
const IPFS_RPC_KEY = 'IPFS_RPC_KEY'

// (protocol)://(host):(port)
const IPFS_RPC_REGEX = /^([\w]*):\/\/(.*):(\d*)$/

export function getDefaultEthNode() {
  return (
    window.localStorage.getItem(DEFAULT_ETH_NODE_KEY) ||
    process.env.REACT_APP_DEFAULT_ETH_NODE ||
    'ws://rinkeby.aragon.network:8546'
  )
}

export function setDefaultEthNode(node) {
  return window.localStorage.setItem(DEFAULT_ETH_NODE_KEY, node)
}

export function getEnsRegistryAddress() {
  return (
    window.localStorage.getItem(ENS_REGISTRY_ADDRESS_KEY) ||
    process.env.REACT_APP_ENS_REGISTRY_ADDRESS ||
    '' // Let the network configuration handle contract address defaults
  )
}

export function getEthNetworkType() {
  return (
    window.localStorage.getItem(ETH_NETWORK_TYPE_KEY) ||
    process.env.REACT_APP_ETH_NETWORK_TYPE ||
    'rinkeby'
  )
}

export function getIpfsGateway() {
  return (
    window.localStorage.getItem(IPFS_GATEWAY_KEY) ||
    process.env.REACT_APP_IPFS_GATEWAY ||
    'https://gateway.ipfs.io/ipfs'
  )
}

export function getIpfsRpc() {
  const rpc =
    window.localStorage.getItem(IPFS_RPC_KEY) ||
    process.env.REACT_APP_IPFS_RPC ||
    ''

  const parsed = rpc.match(IPFS_RPC_REGEX)
  if (parsed) {
    return {
      host: parsed[2],
      port: parsed[3],
      protocol: parsed[1],
    }
  } else {
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

export function setIpfsGateway(gateway) {
  return window.localStorage.setItem(IPFS_GATEWAY_KEY, gateway)
}
