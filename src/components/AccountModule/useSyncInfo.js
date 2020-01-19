import { useState, useEffect, useCallback } from 'react'
import { web3Providers } from '../../environment'
import { getLatestBlockTimestamp } from './utils'
import { pollEvery } from '../../utils'
import { getWeb3 } from '../../web3-utils'

const BLOCK_TIMESTAMP_BLOCK_DELAY = 60000

export const CONNECTION_STATUS_HEALTHY = Symbol('CONNECTION_STATUS_HEALTHY')
export const CONNECTION_STATUS_WARNING = Symbol('CONNECTION_STATUS_WARNING')
export const CONNECTION_STATUS_ERROR = Symbol('CONNECTION_STATUS_ERROR')

export function useSyncInfo(wantedWeb3 = 'default') {
  const selectedWeb3 = getWeb3(web3Providers[wantedWeb3])
  const [isListening, setIsListening] = useState(true)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [connectionStatus, setConnectionStatus] = useState(
    CONNECTION_STATUS_HEALTHY
  )
  const [syncDelay, setSyncDelay] = useState(0)

  const handleWebsocketDrop = useCallback(() => {
    setIsListening(false)
    setConnectionStatus(CONNECTION_STATUS_ERROR)
  }, [])
  // listen to web3 connection drop due to inactivity
  useEffect(() => {
    selectedWeb3.currentProvider.on('end', handleWebsocketDrop)
    selectedWeb3.currentProvider.on('error', handleWebsocketDrop)
  }, [selectedWeb3, handleWebsocketDrop])

  // check for connection loss from the browser
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => {
      setIsOnline(false)
      setConnectionStatus(CONNECTION_STATUS_ERROR)
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
    const pollBlockTimestamp = pollEvery(
      () => ({
        request: () => getLatestBlockTimestamp(),
        onResult: timestamp => {
          const blockDiff = new Date() - new Date(timestamp * 1000)
          const latestBlockDifference = Math.floor(blockDiff / 1000 / 60)
          const connectionHealth =
            latestBlockDifference >= 30
              ? CONNECTION_STATUS_ERROR
              : latestBlockDifference >= 3
              ? CONNECTION_STATUS_WARNING
              : CONNECTION_STATUS_HEALTHY
          setConnectionStatus(connectionHealth)
          setSyncDelay(latestBlockDifference)
        },
      }),
      BLOCK_TIMESTAMP_BLOCK_DELAY
    )
    const cleanUpTimestampPoll = pollBlockTimestamp()

    return () => cleanUpTimestampPoll()
  }, [])

  return {
    connectionStatus,
    isListening,
    isOnline,
    syncDelay,
  }
}
