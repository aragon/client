import {
  STATUS_CONNECTION_ERROR,
  STATUS_CONNECTION_WARNING,
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
    connectionStatus === STATUS_CONNECTION_ERROR || !listening || !online
      ? 'No connection'
      : connectionStatus === STATUS_CONNECTION_WARNING
      ? 'Syncing issues'
      : `Connected to ${clientNetworkName}`
  return connectionMessage
}
