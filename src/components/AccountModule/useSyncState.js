import BN from 'bn.js'
import {
  STATUS_CLIENT_CONNECTION_DROPPED,
  STATUS_CONNECTION_OK,
  STATUS_MAJOR_NETWORK_SLOWDOWN,
  STATUS_NETWORK_SYNC_ISSUES,
  STATUS_TOO_LITTLE_ETH,
  STATUS_WALLET_CONNECTION_DROPPED,
} from './connection-statuses'
import { useWallet } from '../../wallet'

function useSyncState(
  clientListening,
  walletListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay
) {
  const { balance, getBlockNumber } = useWallet()
  const currentBlock = getBlockNumber()
  const minimumTransactionBalance = new BN(0.005)

  if (!clientOnline || !clientListening) {
    return {
      header: '',
      info: '',
      status: STATUS_CLIENT_CONNECTION_DROPPED,
    }
  }

  if (!walletListening) {
    return {
      header: '',
      info: '',
      status: STATUS_WALLET_CONNECTION_DROPPED,
    }
  }

  if (clientSyncDelay >= 30 && walletSyncDelay >= 30) {
    return {
      header: 'Last known state:',
      info: `${clientSyncDelay} min behind`,
      status: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  }

  if (clientSyncDelay >= 3 || walletSyncDelay >= 3) {
    return {
      header: 'Out of sync:',
      info: `${clientSyncDelay} min behind`,
      status: STATUS_NETWORK_SYNC_ISSUES,
    }
  }

  if (balance.lt(minimumTransactionBalance) && balance.gtn(-1)) {
    return {
      header: 'Synced:',
      info: currentBlock ? `current block ${currentBlock}` : '',
      status: STATUS_TOO_LITTLE_ETH,
    }
  }

  return {
    header: 'Synced:',
    info: currentBlock ? `current block ${currentBlock}` : '',
    status: STATUS_CONNECTION_OK,
  }
}

export default useSyncState
