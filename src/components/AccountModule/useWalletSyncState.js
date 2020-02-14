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

export function useWalletSyncState(
  clientListening,
  walletListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay,
  currentBlock
) {
  const { balance } = useWallet()
  const minimumTransactionBalance = new BN(0.005)
  let syncInfo = { header: '', info: '', message: '' }

  if (!clientOnline || !clientListening) {
    syncInfo = {
      header: '',
      info: '',
      message: STATUS_CLIENT_CONNECTION_DROPPED,
    }
  } else if (!walletListening) {
    syncInfo = {
      header: '',
      info: '',
      message: STATUS_WALLET_CONNECTION_DROPPED,
    }
  } else if (clientSyncDelay >= 30 && walletSyncDelay >= 30) {
    syncInfo = {
      header: 'Last known state: ',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  } else if (clientSyncDelay >= 3 || walletSyncDelay >= 3) {
    syncInfo = {
      header: 'Out of sync: ',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_NETWORK_SYNC_ISSUES,
    }
  } else {
    syncInfo = {
      header: 'Synced: ',
      info: `current block ${currentBlock}`,
      message: balance.lt(minimumTransactionBalance)
        ? STATUS_TOO_LITTLE_ETH
        : STATUS_CONNECTION_OK,
    }
  }

  return syncInfo
}
