import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GU, IconCheck, IconCross, Link, textStyle, useTheme } from '@aragon/ui'
import ClientSyncedInfo from './ClientSyncedInfo'
import { getAppPath, getPreferencesSearch } from '../../routing'
import {
  getConnectionMessage,
  useConnectionStatusColor,
  useNetworkConnectionData,
} from './utils'
import {
  CONNECTION_STATUS_ERROR,
  CONNECTION_STATUS_HEALTHY,
  CONNECTION_STATUS_WARNING,
} from './useSyncInfo'

const FlexWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

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
    listening && online ? connectionStatus : CONNECTION_STATUS_ERROR
  )

  const Icon =
    connectionStatus === CONNECTION_STATUS_HEALTHY ? IconCheck : IconCross
  let connectionMessage = getConnectionMessage(
    connectionStatus,
    listening,
    online,
    clientNetworkName
  )

  if (connectionStatus === CONNECTION_STATUS_HEALTHY) {
    connectionMessage = `Connected to Ethereum ${clientNetworkName} Network`
  }

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
        <FlexWrapper
          css={`
            display: flex;
            margin-top: ${1 * GU}px;
            color: ${connectionStatusColor};
            ${textStyle('label2')};
          `}
        >
          <Icon size="small" />
          {clientNetworkName && (
            <span
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              {connectionMessage}
            </span>
          )}
        </FlexWrapper>
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
  let content = null
  const handleNetworkSettingsClick = useCallback(() => {
    window.location.hash = getAppPath({
      dao: locator.dao || '',
      search: getPreferencesSearch('network'),
    })
  }, [locator])

  if (connectionStatus === CONNECTION_STATUS_WARNING) {
    content = (
      <span>
        We've detected the Ethereum node you are connected to seems to be having
        troubles syncing blocks. You can change the node settings in{' '}
        <Link onClick={handleNetworkSettingsClick}>Network Settings.</Link>
      </span>
    )
  }

  if (connectionStatus === CONNECTION_STATUS_ERROR) {
    content = (
      <span>
        We cannot connect to the Ethereum node. You can change the node settings
        in
        <Link onClick={handleNetworkSettingsClick}>Network Settings.</Link>
      </span>
    )
  }

  return (
    <div
      css={`
        margin-top: ${GU}px;
        margin-bottom: ${GU}px;
      `}
    >
      {content}
    </div>
  )
}

ConnectionInfoMessage.propTypes = {
  locator: PropTypes.object,
  connectionStatus: PropTypes.symbol,
}

export default ClientConnectionInfo
