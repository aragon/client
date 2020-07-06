import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@aragon/ui'
import BN from 'bn.js'
import {
  STATUS_CLIENT_CONNECTION_DROPPED,
  STATUS_CONNECTION_OK,
  STATUS_CONNECTION_ERROR,
  STATUS_CONNECTION_HEALTHY,
  STATUS_CONNECTION_WARNING,
  STATUS_MAJOR_NETWORK_SLOWDOWN,
  STATUS_NETWORK_SYNC_ISSUES,
  STATUS_TOO_LITTLE_ETH,
  STATUS_WALLET_CONNECTION_DROPPED,
} from './connection-statuses'
import { network, web3Providers } from '../../environment'
import {
  MAX_PROVIDER_SYNC_DELAY,
  MILD_PROVIDER_SYNC_DELAY,
  OK_PROVIDER_SYNC_DELAY,
  normalizeNetworkName,
} from './utils'
import { pollEvery } from '../../utils'
import { useWallet } from '../../wallet'
import { getWeb3, getLatestBlockTimestamp } from '../../web3-utils'

const BLOCK_TIMESTAMP_POLL_INTERVAL = 60000

export function useNetworkConnectionData() {
  const { web3: walletWeb3 } = useWallet()
  const [walletChainId, setWalletChainId] = useState(-1)
  const clientChainId = network.chainId

  useEffect(() => {
    if (!walletWeb3) {
      return
    }

    let cancelled = false
    walletWeb3.eth.getChainId((err, chainId) => {
      if (!err && !cancelled) {
        setWalletChainId(chainId)
      }
    })
    return () => {
      cancelled = true
    }
  }, [walletWeb3])

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
  const isWalletAndClientSynced =
    Math.abs(walletSyncDelay - clientSyncDelay) <= OK_PROVIDER_SYNC_DELAY
  const networkSlowdown =
    walletSyncDelay >= MILD_PROVIDER_SYNC_DELAY &&
    clientSyncDelay >= MILD_PROVIDER_SYNC_DELAY &&
    isWalletAndClientSynced

  const defaultOkConnectionDetails = {
    connectionMessage: `Connected to ${walletNetworkName}`,
    connectionMessageLong: `Connected to Ethereum ${walletNetworkName} Network`,
    connectionColor: theme.positive,
  }

  if (clientListening && !network.live) {
    return defaultOkConnectionDetails
  }

  if (
    !clientListening ||
    !walletListening ||
    !clientOnline ||
    !walletOnline ||
    networkSlowdown ||
    clientSyncDelay >= MAX_PROVIDER_SYNC_DELAY ||
    walletSyncDelay >= MAX_PROVIDER_SYNC_DELAY
  ) {
    return {
      connectionMessage: 'No connection',
      connectionMessageLong: 'No connection',
      connectionColor: theme.negative,
    }
  } else if (
    walletSyncDelay >= OK_PROVIDER_SYNC_DELAY ||
    clientSyncDelay >= OK_PROVIDER_SYNC_DELAY
  ) {
    return {
      connectionMessage: 'Syncing issues',
      connectionMessageLong: 'Syncing issues',
      connectionColor: theme.warning,
    }
  } else if (hasNetworkMismatch) {
    return {
      connectionMessage: 'Wrong network',
      connectionMessageLong: 'Wrong network',
      connectionColor: theme.warning,
    }
  }

  return defaultOkConnectionDetails
}

export function useSyncInfo(wantedWeb3 = 'default') {
  const wallet = useWallet()
  const clientWeb3 = getWeb3(web3Providers.default)
  const walletWeb3 = wallet.web3
  const selectedWeb3 = wantedWeb3 === 'wallet' ? walletWeb3 : clientWeb3

  const [isListening, setIsListening] = useState(true)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [connectionStatus, setConnectionStatus] = useState(
    STATUS_CONNECTION_HEALTHY
  )
  const [syncDelay, setSyncDelay] = useState(0)

  const handleWebsocketDrop = useCallback(() => {
    setIsListening(false)
    setConnectionStatus(STATUS_CONNECTION_ERROR)
  }, [])

  // listen to web3 connection drop due to inactivity
  useEffect(() => {
    if (!selectedWeb3 || !selectedWeb3.currentProvider) {
      return
    }

    if (selectedWeb3.currentProvider.on) {
      selectedWeb3.currentProvider.on('end', handleWebsocketDrop)
      selectedWeb3.currentProvider.on('error', handleWebsocketDrop)
    }

    return () => {
      if (selectedWeb3.currentProvider.removeEventListener) {
        selectedWeb3.currentProvider.removeListener('end', handleWebsocketDrop)
        selectedWeb3.currentProvider.removeListener(
          'error',
          handleWebsocketDrop
        )
      }
    }
  }, [selectedWeb3, handleWebsocketDrop])

  // check for connection loss from the browser
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => {
      setIsOnline(false)
      setConnectionStatus(STATUS_CONNECTION_ERROR)
    }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // listen for connection status with block timestamps
  useEffect(() => {
    if (!selectedWeb3) {
      return
    }

    const pollBlockTimestamp = pollEvery(
      () => ({
        request: () => getLatestBlockTimestamp(selectedWeb3),
        onResult: timestamp => {
          const blockDiff = new Date() - timestamp
          const latestBlockDifference = Math.floor(blockDiff / 1000 / 60)
          const connectionHealth =
            latestBlockDifference >= 30
              ? STATUS_CONNECTION_ERROR
              : latestBlockDifference >= 3
              ? STATUS_CONNECTION_WARNING
              : STATUS_CONNECTION_HEALTHY
          setConnectionStatus(connectionHealth)
          setSyncDelay(latestBlockDifference)
        },
      }),
      BLOCK_TIMESTAMP_POLL_INTERVAL
    )
    const cleanUpTimestampPoll = pollBlockTimestamp()

    return () => cleanUpTimestampPoll()
  }, [selectedWeb3])

  return {
    connectionStatus,
    isListening,
    isOnline,
    syncDelay,
  }
}

export function useSyncState(
  clientListening,
  walletListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay
) {
  const { balance, getBlockNumber } = useWallet()
  const currentBlock = getBlockNumber()

  const minimumTransactionBalance = new BN(0.005)

  const defaultSyncedStatus = {
    header: 'Synced',
    info: currentBlock ? `: current block ${currentBlock}` : '',
    status: STATUS_CONNECTION_OK,
  }

  if (clientListening && !network.live) {
    return defaultSyncedStatus
  }

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
      header: 'Last known state',
      info: `: ${clientSyncDelay} min behind`,
      status: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  }

  if (clientSyncDelay >= 3 || walletSyncDelay >= 3) {
    return {
      header: 'Out of sync',
      info: `: ${clientSyncDelay} min behind`,
      status: STATUS_NETWORK_SYNC_ISSUES,
    }
  }

  if (balance.lt(minimumTransactionBalance) && balance.gtn(-1)) {
    return {
      header: 'Synced',
      info: currentBlock ? `:current block ${currentBlock}` : '',
      status: STATUS_TOO_LITTLE_ETH,
    }
  }

  return defaultSyncedStatus
}
