const DEFAULT_ETH_NODE_KEY = 'ETH_NODE_KEY'
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
