import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@aragon/ui'
import ClientSyncedInfo from './ClientSyncedInfo'
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
  syncDelay,
  online,
  listening,
}) {
  const theme = useTheme()
  const { clientNetworkName } = useNetworkConnectionData()

  const Icon =
    connectionStatus === CONNECTION_STATUS_HEALTHY ? IconCheck : IconCross
  const connectionStatusColor = useConnectionStatusColor(
    listening && online ? connectionStatus : CONNECTION_STATUS_ERROR
  )
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
        <ConnectionInfoMessage connectionStatus={connectionStatus} />
      </div>
    </section>
  )
}

ClientConnectionInfo.propTypes = {
  connectionStatus: PropTypes.symbol,
  listening: PropTypes.bool,
  online: PropTypes.bool,
  syncDelay: PropTypes.number,
}

function ConnectionInfoMessage({ connectionStatus }) {
  let content = null

  if (connectionStatus === CONNECTION_STATUS_WARNING) {
    content = (
      <span>
        We've detected the Ethereum node you are connected to seems to be having
        troubles syncing blocks. You can change the node settings in Network
        Settings.
      </span>
    )
  }

  if (connectionStatus === CONNECTION_STATUS_ERROR) {
    content = (
      <span>
        We cannot connect to the Ethereum node. You can change the node settings
        in Network Settings.
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
  connectionStatus: PropTypes.symbol,
}

export default ClientConnectionInfo
