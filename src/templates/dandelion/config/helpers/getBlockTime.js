import CHAIN_IDS from '../../../../chain-ids'
import { network } from '../../../../environment'

// Estimates based on block propagation rates in Feb. 2020
const NETWORK_TIMES = new Map([
  [CHAIN_IDS.ETHEREUM, 13],
  [CHAIN_IDS.ROPSTEN, 11],
  [CHAIN_IDS.RINKEBY, 14],
  [CHAIN_IDS.KOVAN, 4],
  [CHAIN_IDS.GOERLI, 15],
])
const UNKNOWN_NETWORK_BLOCK_TIME = 2

export default function getBlockTime() {
  return network
    ? NETWORK_TIMES.get(network.chainId) || UNKNOWN_NETWORK_BLOCK_TIME
    : null
}
