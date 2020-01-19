import { useState, useEffect } from 'react'
import { useTheme } from '@aragon/ui'
import { web3Providers, network } from '../../environment'
import { getNetworkByChainId } from '../../network-config'
import { getWeb3 } from '../../web3-utils'
import {
  CONNECTION_STATUS_ERROR,
  CONNECTION_STATUS_WARNING,
} from './useSyncInfo'

const connectionMessages = {
  userConnectionDropped: `We cannot connect to the wallet's Ethereum node. You can change the node settings in Network Settings. You will still see new transactions from the client appear.`,
  clientConnectionDropped:
    'We cannot connect to the Ethereum node. You can change the node settings in Network Settings, or refresh the client.',
  networkSyncingIssues: `We've detected the Ethereum node you are connected to seems to be having troubles syncing blocks. You can change the node settings in Network Settings.`,
  majorNetworkSlowdown: `We've detected the Ethereum node you are connected to seems to be having troubles syncing blocks. You can change the node settings in Network Settings. Do not sign any transactions until this error disappears.`,
}

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

export function useWalletConnectionDetails(
  clientListening,
  userListening,
  clientOnline,
  userOnline,
  clientSyncDelay,
  userSyncDelay,
  clientNetworkName
) {
  const theme = useTheme()
  let connectionDetails = {}
  const networkSlowdown =
    userSyncDelay >= 5 &&
    clientSyncDelay >= 5 &&
    Math.abs(userSyncDelay - clientSyncDelay) <= 3

  if (
    !clientListening ||
    !userListening ||
    !clientOnline ||
    !userOnline ||
    networkSlowdown ||
    clientSyncDelay >= 30 ||
    userSyncDelay >= 30
  ) {
    connectionDetails = {
      connectionMessage: 'No connection',
      connectionColor: theme.negative,
    }
  } else if (userSyncDelay >= 3 || clientSyncDelay >= 3) {
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

export function resolveUserSyncInfo(
  clientListening,
  userListening,
  clientOnline,
  clientSyncDelay,
  userSyncDelay,
  currentBlock
) {
  let syncInfo = { header: '', info: '', message: '' }
  if (!clientOnline || !clientListening) {
    syncInfo = {
      header: '',
      info: '',
      message: connectionMessages.clientConnectionDropped,
    }
  } else if (!userListening) {
    syncInfo = {
      header: '',
      info: '',
      message: connectionMessages.userConnectionDropped,
    }
  } else if (clientSyncDelay >= 30 && userSyncDelay >= 30) {
    syncInfo = {
      header: 'Last known state: ',
      info: `${clientSyncDelay} min behind`,
      message: connectionMessages.majorNetworkSlowdown,
    }
  } else if (clientSyncDelay >= 3 || clientSyncDelay >= 3) {
    syncInfo = {
      header: 'Out of sync: ',
      info: `${clientSyncDelay} min behind`,
      message: connectionMessages.networkSyncingIssues,
    }
  } else {
    syncInfo = {
      header: 'Synced: ',
      info: `current block ${currentBlock}`,
      message: '',
    }
  }

  return syncInfo
}
