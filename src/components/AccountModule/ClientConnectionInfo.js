import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, IconCheck, IconCross, Link, textStyle, useTheme } from '@aragon/ui'
import { getAppPath, getPreferencesSearch } from '../../routing'
import ClientSyncedInfo from './ClientSyncedInfo'
import {
  STATUS_CONNECTION_ERROR,
  STATUS_CONNECTION_HEALTHY,
  STATUS_CONNECTION_WARNING,
} from './connection-statuses'
import {
  useConnectionStatusColor,
  useNetworkConnectionData,
} from './connection-hooks'
import { network } from '../../environment'
import { getConnectionMessage } from './utils'

function ClientConnectionInfo({
  connectionStatus,
  listening,
  locator,
  online,
  syncDelay,
}) {
  const theme = useTheme()
  const { clientNetworkName } = useNetworkConnectionData()
  const connectionStatusColor = useConnectionStatusColor(
    listening && online ? connectionStatus : STATUS_CONNECTION_ERROR
  )

  const IconConnectionStatus =
    connectionStatus === STATUS_CONNECTION_HEALTHY ? IconCheck : IconCross
  let connectionMessage = getConnectionMessage(
    connectionStatus,
    listening,
    online,
    clientNetworkName
  )

  return (
    <section
      css={`
        max-width: ${51 * GU}px;
      `}
    >
      <h1
        css={`
          display: flex;
          align-items: center;
          height: ${4 * GU}px;
          padding: 0 ${2 * GU}px;
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          border-bottom: 1px solid ${theme.border};
        `}
      >
        Ethereum connection
      </h1>

      <div
        css={`
          padding: ${2 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin-top: ${1 * GU}px;
            color: ${connectionStatusColor};
            ${textStyle('label2')};
          `}
        >
          <IconConnectionStatus size="small" />
          {connectionMessage && (
            <span
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              {connectionMessage}
            </span>
          )}
        </div>
        <ClientSyncedInfo
          syncDelay={syncDelay}
          listening={listening}
          online={online}
        />
        <ConnectionInfoMessage
          locator={locator}
          connectionStatus={connectionStatus}
        />
      </div>
    </section>
  )
}

ClientConnectionInfo.propTypes = {
  connectionStatus: PropTypes.symbol,
  listening: PropTypes.bool,
  locator: PropTypes.object,
  online: PropTypes.bool,
  syncDelay: PropTypes.number,
}

function ConnectionInfoMessage({ connectionStatus, locator }) {
  const handleNetworkSettingsClick = useCallback(() => {
    window.location.hash = getAppPath({
      dao: locator.dao || '',
      search: getPreferencesSearch('network'),
    })
  }, [locator])

  let content = null

  if (connectionStatus === STATUS_CONNECTION_WARNING) {
    content = (
      <span>
        The Ethereum node you are connected may not accurately reflect the
        current state of Ethereum's {network.name}. You can change the node
        settings in{' '}
        <Link onClick={handleNetworkSettingsClick}>Network Settings</Link>.
      </span>
    )
  }

  if (connectionStatus === STATUS_CONNECTION_ERROR) {
    content = (
      <span>
        We were unable to connect to the configured Ethereum node. You can
        change the node settings in{' '}
        <Link onClick={handleNetworkSettingsClick}>Network Settings</Link>.
      </span>
    )
  }

  return (
    content && (
      <div
        css={`
          margin-top: ${1 * GU}px;
          margin-bottom: ${1 * GU}px;
        `}
      >
        {content}
      </div>
    )
  )
}

ConnectionInfoMessage.propTypes = {
  locator: PropTypes.object,
  connectionStatus: PropTypes.symbol,
}

export default ClientConnectionInfo
