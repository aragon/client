import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { useClientBlockNumber } from './useClientBlockNumber'
import { getClientSyncState } from './utils'

function ClientSyncedInfo({ listening, online, syncDelay }) {
  const latestClientBlockNumber = useClientBlockNumber()
  const { header, info } = getClientSyncState(
    listening,
    online,
    syncDelay,
    latestClientBlockNumber
  )

  return (
    <React.Fragment>
      {header && info && (
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
            {header}
          </span>
          <span>{info}</span>
        </div>
      )}
    </React.Fragment>
  )
}

ClientSyncedInfo.propTypes = {
  listening: PropTypes.bool,
  online: PropTypes.bool,
  syncDelay: PropTypes.number,
}

export default ClientSyncedInfo
