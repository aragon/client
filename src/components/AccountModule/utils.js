import { useState, useEffect } from 'react'
import { useTheme } from '@aragon/ui'
import { fromWei } from 'web3-utils'
import { web3Providers, network } from '../../environment'
import { getNetworkByChainId } from '../../network-config'
import { getWeb3 } from '../../web3-utils'
import { useWallet } from '../../wallet'
import {
  CONNECTION_STATUS_ERROR,
  CONNECTION_STATUS_WARNING,
} from './useSyncInfo'

export const STATUS_WALLET_CONNECTION_DROPPED = Symbol(
  'STATUS_WALLET_CONNECTION_DROPPED'
)
export const STATUS_CLIENT_CONNECTION_DROPPED = Symbol(
  'STATUS_CLIENT_CONNECTION_DROPPED'
)
export const STATUS_NETWORK_SYNC_ISSUES = Symbol('STATUS_NETWORK_SYNC_ISSUES')
export const STATUS_MAJOR_NETWORK_SLOWDOWN = Symbol(
  'STATUS_MAJOR_NETWORK_SLOWDOWN'
)
export const STATUS_TOO_LITTLE_ETH = Symbol('STATUS_TOO_LITTLE_ETH')
export const STATUS_CONNECTION_OK = Symbol('')
// window.location.hash = getAppPath({
//  // … (current state)
//  search: getPreferencesSearch('network')
// })

export function useConnectionStatusColor(status) {
  const theme = useTheme()
  if (status === CONNECTION_STATUS_ERROR) {
    return theme.negative
  }
  if (status === CONNECTION_STATUS_WARNING) {
    return theme.warning
  }
  return theme.positive
}

export function useWalletConnectionDetails(
  clientListening,
  walletListening,
  clientOnline,
  walletOnline,
  clientSyncDelay,
  walletSyncDelay,
  clientNetworkName
) {
  const theme = useTheme()
  let connectionDetails = {}
  const networkSlowdown =
    walletSyncDelay >= 5 &&
    clientSyncDelay >= 5 &&
    Math.abs(walletSyncDelay - clientSyncDelay) <= 3

  if (
    !clientListening ||
    !walletListening ||
    !clientOnline ||
    !walletOnline ||
    networkSlowdown ||
    clientSyncDelay >= 30 ||
    walletSyncDelay >= 30
  ) {
    connectionDetails = {
      connectionMessage: 'No connection',
      connectionColor: theme.negative,
    }
  } else if (walletSyncDelay >= 3 || clientSyncDelay >= 3) {
    connectionDetails = {
      connectionMessage: 'Syncing issues',
      connectionColor: theme.warning,
    }
  } else {
    connectionDetails = {
      connectionMessage: `Connected to ${clientNetworkName}`,
      connectionColor: theme.positive,
    }
  }
  return connectionDetails
}

export async function getLatestBlockTimestamp() {
  const clientWeb3 = getWeb3(web3Providers.default)
  const latestBlockInfo = await clientWeb3.eth.getBlock('latest')
  if (!latestBlockInfo) {
    return 0 // we should have a retry mechanism
  }
  return latestBlockInfo.timestamp
}

function normalizeNetworkName(chainId) {
  return getNetworkByChainId(chainId).settings.shortName
}

export const useNetworkConnectionData = () => {
  const [walletChainId, setWalletChainId] = useState(-1)
  const clientChainId = network.chainId

  useEffect(() => {
    const walletWeb3 = getWeb3(web3Providers.wallet)
    walletWeb3.eth.getChainId((err, chainId) => {
      if (!err) {
        setWalletChainId(chainId)
      }
    })
  }, [])

  return {
    walletNetworkName: normalizeNetworkName(walletChainId),
    clientNetworkName: normalizeNetworkName(clientChainId),
    hasNetworkMismatch: walletChainId !== -1 && walletChainId !== clientChainId,
  }
}

export function getConnectionMessage(
  connectionStatus,
  listening,
  online,
  clientNetworkName
) {
  const connectionMessage =
    connectionStatus === CONNECTION_STATUS_ERROR || !listening || !online
      ? 'No connection'
      : connectionStatus === CONNECTION_STATUS_WARNING
      ? 'Syncing issues'
      : `Connected to ${clientNetworkName}`
  return connectionMessage
}

export function getClientSyncState(
  listening,
  online,
  syncDelay,
  latestClientBlockNumber
) {
  if (!listening || !online || syncDelay >= 45) {
    return {
      header: '',
      info: '',
    }
  }

  if (syncDelay >= 30) {
    return {
      header: 'Last known state:',
      info: `${syncDelay} min behind`,
    }
  }

  if (syncDelay >= 3) {
    return {
      header: 'Out of sync',
      info: `${syncDelay} min behind`,
    }
  }

  return {
    header: 'Synced',
    info: `current block ${latestClientBlockNumber}`,
  }
}

export function useWalletSyncState(
  clientListening,
  walletListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay,
  currentBlock
) {
  const { balance: balanceInWei } = useWallet()
  const balance = fromWei(balanceInWei)
  let syncInfo = { header: '', info: '', message: '' }

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
      header: 'Last known state:',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  }

  if (clientSyncDelay >= 3 || clientSyncDelay >= 3) {
    return {
      header: 'Out of sync:',
      info: `${clientSyncDelay} min behind`,
      message: STATUS_NETWORK_SYNC_ISSUES,
    }
  }

  return {
    header: 'Synced:',
    info: currentBlock ? `current block ${currentBlock}` : 'unknown',
    message: balance < 0.005 ? STATUS_TOO_LITTLE_ETH : STATUS_CONNECTION_OK,
  }
}
