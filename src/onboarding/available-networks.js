import CHAIN_IDS from '../chain-ids'
import { network } from '../environment'

const AVAILABLE_NETWORKS = [
  [CHAIN_IDS.ETHEREUM, 'Ethereum Mainnet', 'https://mainnet.aragon.org/'],
  [
    CHAIN_IDS.RINKEBY,
    'Ethereum Testnet (Rinkeby)',
    'https://rinkeby.aragon.org/',
  ],
]
if (network.chainId === CHAIN_IDS.ROPSTEN) {
  AVAILABLE_NETWORKS.push([
    CHAIN_IDS.ROPSTEN,
    'Ethereum Testnet (Ropsten)',
    'https://aragon.ropsten.aragonpm.com/',
  ])
}
if (network.chainId === CHAIN_IDS.XDAI) {
  AVAILABLE_NETWORKS.push([CHAIN_IDS.XDAI, 'xDai', 'http://aragon.1hive.org/'])
}

// Map of { chainId, name, url } for each available network
export default AVAILABLE_NETWORKS.map(([chainId, name, url]) => ({
  chainId,
  name,
  url,
})).sort((a, b) => {
  if (b.chainId === network.chainId) return 1
  if (a.chainId === network.chainId) return -1
  return 0
})
