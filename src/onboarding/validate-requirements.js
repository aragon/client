import BN from 'bn.js'
import { fromWei, toWei, formatBalance } from '../web3-utils'

const EXPECTED_NETWORK_ID = process.env.ARAGON_ETH_NETWORK_TYPE
const MINIMUM_BALANCE = new BN(toWei('0.1'))
const BALANCE_DECIMALS = 3

function isBalanceUnknown(balance) {
  return !balance || balance.eqn(-1)
}

function localFormatBalance(balance) {
  return isBalanceUnknown(balance)
    ? '0'
    : formatBalance(balance, { precision: BALANCE_DECIMALS })
}

function validateCreationRequirements(
  account,
  balance,
  isContractAccount,
  networkId,
  selectorNetworks
) {
  /*
   * The local launcher sets the network to 'private' while
   * Metamask returns 'local
   */
  const localNames = networkId === 'private' && EXPECTED_NETWORK_ID === 'local'

  if (!account) {
    return ['no-account']
  }
  if (networkId !== EXPECTED_NETWORK_ID && !localNames) {
    const supported =
      selectorNetworks.filter(([type, name, url]) => type === networkId)
        .length !== 0

    return [
      'wrong-network',
      {
        expected: EXPECTED_NETWORK_ID,
        actual: networkId,
        supported,
      },
    ]
  }
  if (isBalanceUnknown(balance)) {
    return [
      'unknown-balance',
      {
        minimumBalance: fromWei(String(MINIMUM_BALANCE)),
      },
    ]
  }
  if (balance.lt(MINIMUM_BALANCE) && !(isContractAccount === true)) {
    return [
      'minimum-balance',
      {
        balance: localFormatBalance(balance),
        minimumBalance: fromWei(String(MINIMUM_BALANCE)),
      },
    ]
  }
  return [null]
}

export default validateCreationRequirements
