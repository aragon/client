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

  if (!clientOnline || !clientListening) {
    return {
      header: '',
      info: '',
      message: STATUS_CLIENT_CONNECTION_DROPPED,
    }
  }

  if (!walletListening) {
    return {
      header: '',
      info: '',
      message: STATUS_WALLET_CONNECTION_DROPPED,
    }
  }

  if (clientSyncDelay >= 30 && walletSyncDelay >= 30) {
    return {
      header: 'Last known state: ',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  }

  if (clientSyncDelay >= 3 || walletSyncDelay >= 3) {
    return {
      header: 'Out of sync: ',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_NETWORK_SYNC_ISSUES,
    }
  }

  return {
    header: 'Synced: ',
    info: `current block ${currentBlock}`,
    message: balance.lt(minimumTransactionBalance)
      ? STATUS_TOO_LITTLE_ETH
      : STATUS_CONNECTION_OK,
  }
}
