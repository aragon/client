import { useEffect, useState, useMemo } from 'react'
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
import {
  MAX_PROVIDER_SYNC_DELAY,
  MILD_PROVIDER_SYNC_DELAY,
  OK_PROVIDER_SYNC_DELAY,
} from './utils'
import { pollEvery } from '../../util/utils'
import {
  useWallet,
  ChainUnsupportedError,
  WALLET_STATUS,
} from '../../contexts/wallet'
import { getWeb3, getLatestBlockTimestamp } from '../../util/web3'
import {
  getNetworkSettings,
  normalizeNetworkName,
  getNetworkFullName,
} from '../../util/network'
import { useClientWeb3 } from '../../contexts/ClientWeb3Context'
import { getNetworkConfig } from '../../network-config'

const BLOCK_TIMESTAMP_POLL_INTERVAL = 60000

export function useNetworkConnectionData() {
  const { networkType, status, error } = useWallet()

  const isWrongNetwork = useMemo(() => {
    return (
      status === WALLET_STATUS.error && error instanceof ChainUnsupportedError
    )
  }, [status, error])

  return {
    walletNetworkName: normalizeNetworkName(networkType),
    walletNetworkFullName: getNetworkFullName(networkType),
    isWrongNetwork,
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
  const {
    walletNetworkName,
    walletNetworkFullName,
    isWrongNetwork,
  } = useNetworkConnectionData()

  const theme = useTheme()
  const { networkType } = useWallet()
  const networkSettings = getNetworkSettings(networkType)
  const networkConfig = getNetworkConfig(networkType)

  const maxProviderSyncDelay =
    networkConfig.settings?.customSyncDelays?.MAX_PROVIDER_SYNC_DELAY ||
    MAX_PROVIDER_SYNC_DELAY
  const mildProviderSyncDelay =
    networkConfig.settings?.customSyncDelays?.MILD_PROVIDER_SYNC_DELAY ||
    MILD_PROVIDER_SYNC_DELAY
  const okProviderSyncDelay =
    networkConfig.settings?.customSyncDelays?.OK_PROVIDER_SYNC_DELAY ||
    OK_PROVIDER_SYNC_DELAY

  const isWalletAndClientSynced =
    Math.abs(walletSyncDelay - clientSyncDelay) <= okProviderSyncDelay
  const networkSlowdown =
    walletSyncDelay >= mildProviderSyncDelay &&
    clientSyncDelay >= mildProviderSyncDelay &&
    isWalletAndClientSynced

  const defaultOkConnectionDetails = {
    connectionMessage: `Connected to ${walletNetworkName}`,
    connectionMessageLong: `Connected to ${walletNetworkFullName} Network`,
    connectionColor: theme.positive,
  }

  if (clientListening && !networkSettings.live) {
    return defaultOkConnectionDetails
  }

  if (
    !clientListening ||
    !walletListening ||
    !clientOnline ||
    !walletOnline ||
    networkSlowdown ||
    clientSyncDelay >= maxProviderSyncDelay ||
    walletSyncDelay >= maxProviderSyncDelay
  ) {
    return {
      connectionMessage: 'No connection',
      connectionMessageLong: 'No connection',
      connectionColor: theme.negative,
    }
  } else if (
    walletSyncDelay >= okProviderSyncDelay ||
    clientSyncDelay >= okProviderSyncDelay
  ) {
    return {
      connectionMessage: 'Syncing issues',
      connectionMessageLong: 'Syncing issues',
      connectionColor: theme.warning,
    }
  } else if (isWrongNetwork) {
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
  const { web3: clientWeb3 } = useClientWeb3()
  const walletWeb3 = wallet.web3
  const selectedWeb3 =
    wantedWeb3 === 'wallet' ? walletWeb3 : getWeb3(clientWeb3)
  const [isListening, setIsListening] = useState(true)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [connectionStatus, setConnectionStatus] = useState(
    STATUS_CONNECTION_HEALTHY
  )
  const [syncDelay, setSyncDelay] = useState(0)

  // listen to web3 connection drop due to inactivity
  useEffect(() => {
    if (!selectedWeb3 || !selectedWeb3.currentProvider) {
      return
    }
    let cancel = false
    const handleWebsocketDrop = () => {
      if (!cancel) {
        setIsListening(false)
        setConnectionStatus(STATUS_CONNECTION_ERROR)
      }
    }
    if (selectedWeb3.currentProvider.on) {
      selectedWeb3.currentProvider.on('error', handleWebsocketDrop)
    }
    return () => {
      cancel = true
      if (selectedWeb3.currentProvider.connection?.removeEventListener) {
        selectedWeb3.currentProvider.connection.removeEventListener(
          'error',
          handleWebsocketDrop
        )
      }
    }
  }, [selectedWeb3])

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
    let cancel = false
    const pollBlockTimestamp = pollEvery(
      () => ({
        request: async () => {
          if (!cancel) {
            return getLatestBlockTimestamp(selectedWeb3).catch(err => {
              if (!cancel) {
                console.error('Get latest block timestamp', err)
                setIsListening(false)
                setConnectionStatus(STATUS_CONNECTION_ERROR)
              }
              return 0
            })
          }
        },
        onResult: timestamp => {
          if (!cancel) {
            const now = new Date()
            const blockDiff = now - timestamp
            const latestBlockDifference = Math.floor(blockDiff / 1000 / 60)
            const connectionHealth =
              latestBlockDifference >= 30
                ? STATUS_CONNECTION_ERROR
                : latestBlockDifference >= 3
                ? STATUS_CONNECTION_WARNING
                : STATUS_CONNECTION_HEALTHY
            setConnectionStatus(connectionHealth)
            setSyncDelay(latestBlockDifference)
            if (connectionHealth === STATUS_CONNECTION_HEALTHY) {
              setIsListening(true)
            }
          }
        },
      }),
      BLOCK_TIMESTAMP_POLL_INTERVAL
    )
    const cleanUpTimestampPoll = pollBlockTimestamp()
    return () => {
      cancel = true
      cleanUpTimestampPoll()
    }
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
  const { balance, getBlockNumber, networkType } = useWallet()
  const currentBlock = getBlockNumber()

  const minimumTransactionBalance = new BN(0.005)

  const defaultSyncedStatus = {
    header: 'Synced',
    info: currentBlock ? `: current block ${currentBlock}` : '',
    status: STATUS_CONNECTION_OK,
  }

  const networkSettings = getNetworkSettings(networkType)

  if (clientListening && !networkSettings.live) {
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

  const networkConfig = getNetworkConfig(networkType)

  const maxProviderSyncDelay =
    networkConfig.settings?.customSyncDelays?.MAX_PROVIDER_SYNC_DELAY ||
    MAX_PROVIDER_SYNC_DELAY
  const okProviderSyncDelay =
    networkConfig.settings?.customSyncDelays?.OK_PROVIDER_SYNC_DELAY ||
    OK_PROVIDER_SYNC_DELAY

  if (
    clientSyncDelay >= maxProviderSyncDelay &&
    walletSyncDelay >= maxProviderSyncDelay
  ) {
    return {
      header: 'Last known state',
      info: `: ${clientSyncDelay} min behind`,
      status: STATUS_MAJOR_NETWORK_SLOWDOWN,
    }
  }

  if (
    clientSyncDelay >= okProviderSyncDelay ||
    walletSyncDelay >= okProviderSyncDelay
  ) {
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
