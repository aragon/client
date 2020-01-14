import { useState, useEffect, useCallback } from 'react'
import { web3Providers } from '../../environment'
import { getLatestBlockTimestamp } from './utils'
import { pollEvery } from '../../utils'
import { getWeb3 } from '../../web3-utils'

const BLOCK_TIMESTAMP_BLOCK_DELAY = 60000

export function useSyncInfo(wantedWeb3 = 'default') {
  const selectedWeb3 = getWeb3(web3Providers[wantedWeb3])
  const [isListening, setIsListening] = useState(true)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [connectionStatus, setConnectionStatus] = useState('healthy')
  const [syncDelay, setSyncDelay] = useState(0)

  const handleWebsocketDrop = useCallback(() => {
    setIsListening(false)
    setConnectionStatus('error')
  }, [])
  // listen to web3 connection drop due to inactivity
  useEffect(() => {
    selectedWeb3.currentProvider.on('end', handleWebsocketDrop)
    selectedWeb3.currentProvider.on('error', handleWebsocketDrop)
  }, [selectedWeb3, handleWebsocketDrop])

  const goOnline = () => setIsOnline(true)
  const goOffline = () => setIsOnline(false)

  // check for connection loss from the browser
  useEffect(() => {
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
              ? 'error'
              : latestBlockDifference >= 3
              ? 'warning'
              : 'healthy'
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
