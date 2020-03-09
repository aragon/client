import BN from 'bn.js'
import { fromWei, toWei, formatBalance } from '../web3-utils'

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

function validateCreationRequirements(account, balance, isContractAccount) {
  if (!account) {
    return ['no-account']
  }
  if (
    !isBalanceUnknown(balance) &&
    balance.lt(MINIMUM_BALANCE) &&
    !(isContractAccount === true)
  ) {
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
