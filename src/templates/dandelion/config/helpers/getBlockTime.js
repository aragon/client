// Estimates based on block propagation rates in Feb. 2020
const NETWORK_TIMES = new Map([
  ['main', 13],
  ['kovan', 4],
  ['rinkeby', 14],
  ['ropsten', 11],
  ['goerli', 15],
  ['private', 2],
  ['matic', 2],
  ['mumbai', 2],
  ['harmonyTest', 2],
  ['harmony', 3],
  ['bsc', 3],
  ['bscTest', 3],
])
export default function getBlockTime(networkType) {
  return NETWORK_TIMES.get(networkType) || null
}
