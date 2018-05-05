const DEFAULT_ETH_NODE_KEY = 'ETH_NODE_KEY'
const ENS_REGISTRY_ADDRESS_KEY = 'ENS_REGISTRY_ADDRESS_KEY'
const ETH_NETWORK_TYPE_KEY = 'ETH_NETWORK_TYPE_KEY'
const IPFS_GATEWAY_KEY = 'IPFS_GATEWAY_KEY'

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
    '0xfbae32d1cde62858bc45f51efc8cc4fa1415447e' // Aragon's Rinkeby ENS
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

export function setIpfsGateway(gateway) {
  return window.localStorage.setItem(IPFS_GATEWAY_KEY, gateway)
}
