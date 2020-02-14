import { network } from '../../../../environment'

// Estimates based on block propagation rates in Feb. 2020
const NETWORK_TIMES = new Map([
  ['main', 13],
  ['kovan', 4],
  ['rinkeby', 14],
  ['ropsten', 11],
  ['goerli', 15],
  ['private', 2],
])
export default function getBlockTime() {
  return network ? NETWORK_TIMES.get(network.type) : null
}
