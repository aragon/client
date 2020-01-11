import React from 'react'
import styled from 'styled-components'
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@aragon/ui'
import { useNetworkConnectionData } from './utils'
import ClientSyncedInfo from './ClientSyncedInfo'

const FlexWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

function ClientConnectionInfo({ connectionType, latestBlockTimestamp }) {
  const theme = useTheme()

  const { clientNetworkName } = useNetworkConnectionData()

  const Icon = connectionType === 'healthy' ? IconCheck : IconCross
  const connectionStatusColor =
    connectionType === 'healthy'
      ? theme.positive
      : connectionType === 'warning'
      ? theme.warning
      : theme.negative

  return (
    <section
      css={`
        max-width: ${42 * GU}px;
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
              Connected to Ethereum {clientNetworkName} Network
            </span>
          )}
        </FlexWrapper>
        <ClientSyncedInfo latestBlockTimestamp={latestBlockTimestamp} />
      </div>
    </section>
  )
}

export default ClientConnectionInfo
