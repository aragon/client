import { useState, useEffect } from 'react'
import { useTheme } from '@aragon/ui'
import { web3Providers, network } from '../../environment'
import { getWeb3 } from '../../web3-utils'
import {
  STATUS_CONNECTION_ERROR,
  STATUS_CONNECTION_WARNING,
} from './connection-statuses'
import {
  MAX_PROVIDER_SYNC_DELAY,
  MILD_PROVIDER_SYNC_DELAY,
  OK_PROVIDER_SYNC_DELAY,
  normalizeNetworkName,
} from './utils'

export function useConnectionStatusColor(status) {
  const theme = useTheme()
  if (status === STATUS_CONNECTION_ERROR) {
    return theme.negative
  }
  if (status === STATUS_CONNECTION_WARNING) {
    return theme.warning
  }
  return theme.positive
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

export function useWalletConnectionDetails(
  clientListening,
  walletListening,
  clientOnline,
  walletOnline,
  clientSyncDelay,
  walletSyncDelay
) {
  const { walletNetworkName, hasNetworkMismatch } = useNetworkConnectionData()
  const theme = useTheme()
  let connectionDetails = {}
  const isWalletAndClientSynced =
    Math.abs(walletSyncDelay - clientSyncDelay) <= OK_PROVIDER_SYNC_DELAY
  const networkSlowdown =
    walletSyncDelay >= MILD_PROVIDER_SYNC_DELAY &&
    clientSyncDelay >= MILD_PROVIDER_SYNC_DELAY &&
    isWalletAndClientSynced

  if (
    !clientListening ||
    !walletListening ||
    !clientOnline ||
    !walletOnline ||
    networkSlowdown ||
    clientSyncDelay >= MAX_PROVIDER_SYNC_DELAY ||
    walletSyncDelay >= MAX_PROVIDER_SYNC_DELAY
  ) {
    connectionDetails = {
      connectionMessage: 'No connection',
      connectionMessageLong: 'No connection',
      connectionColor: theme.negative,
    }
  } else if (
    walletSyncDelay >= OK_PROVIDER_SYNC_DELAY ||
    clientSyncDelay >= OK_PROVIDER_SYNC_DELAY
  ) {
    connectionDetails = {
      connectionMessage: 'Syncing issues',
      connectionMessageLong: 'Syncing issues',
      connectionColor: theme.warning,
    }
  } else if (hasNetworkMismatch) {
    connectionDetails = {
      connectionMessage: 'Wrong network',
      connectionMessageLong: 'Wrong network',
      connectionColor: theme.warning,
    }
  } else {
    connectionDetails = {
      connectionMessage: `Connected to ${walletNetworkName}`,
      connectionMessageLong: `Connected to Ethereum ${walletNetworkName} Network`,
      connectionColor: theme.positive,
    }
  }
  return connectionDetails
}
