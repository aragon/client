import React from 'react'
import PropTypes from 'prop-types'
import { GU, useTheme } from '@aragon/ui'
import { useClientBlockNumber } from './useClientBlockNumber'
import { getClientSyncState } from './utils'

function ClientSyncedInfo({ listening, online, syncDelay }) {
  const latestClientBlockNumber = useClientBlockNumber()
  const theme = useTheme()
  const { state, description } = getClientSyncState(
    listening,
    online,
    syncDelay,
    latestClientBlockNumber
  )

  return (
    <React.Fragment>
      {state && description && (
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          <span
            css={`
              padding-right: ${1 * GU}px;
              color: ${theme.surfaceSecondary};
            `}
          >
            {state}
          </span>
          <span>{description}</span>
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
