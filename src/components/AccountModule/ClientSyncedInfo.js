import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { useClientBlockNumber } from './useClientBlockNumber'
import { getSyncInfo } from './utils'

function ClientSyncedInfo({ latestBlockTimestamp }) {
  const latestClientBlockNumber = useClientBlockNumber()

  const { connectionType, syncHeader, syncInfo } = getSyncInfo(
    latestBlockTimestamp
  )

  const correctSyncInfo = syncInfo.includes('current')
    ? `${syncInfo} ${latestClientBlockNumber}`
    : syncInfo

  return connectionType !== 'dropped' ? (
    <div
      css={`
        margin-top: ${1 * GU}px;
      `}
    >
      <span
        css={`
          padding-right: ${1 * GU}px;
          opacity: 0.8;
        `}
      >
        {syncHeader}
      </span>
      <span>{correctSyncInfo}</span>
    </div>
  ) : null
}

ClientSyncedInfo.propTypes = {
  latestBlockTimestamp: PropTypes.number,
}

export default ClientSyncedInfo
