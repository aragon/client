import {
  CONNECTION_STATUS_ERROR,
  CONNECTION_STATUS_WARNING,
} from './connection-statuses'

export const DROPPED_PROVIDER_SYNC_DELAY = 45
export const MAX_PROVIDER_SYNC_DELAY = 30
export const MILD_PROVIDER_SYNC_DELAY = 5
export const OK_PROVIDER_SYNC_DELAY = 3

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
  if (!listening || !online || syncDelay >= DROPPED_PROVIDER_SYNC_DELAY) {
    return {
      state: '',
      description: '',
    }
  }

  if (syncDelay >= MAX_PROVIDER_SYNC_DELAY) {
    return {
      state: 'Last known state:',
      description: `${syncDelay} min behind`,
    }
  }

  if (syncDelay >= OK_PROVIDER_SYNC_DELAY) {
    return {
      state: 'Out of sync:',
      description: `${syncDelay} min behind`,
    }
  }

  return {
    state: 'Synced:',
    description: `current block ${latestClientBlockNumber}`,
  }
}
