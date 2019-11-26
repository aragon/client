import React from 'react'
import { GU } from '@aragon/ui'
import { useWalletBlockNumber } from '../../wallet'

function SyncedInfo() {
  const blockNumber = useWalletBlockNumber()
  return (
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
        Synced:
      </span>
      <span>current block: {blockNumber || '…'}</span>
    </div>
  )
}

export default SyncedInfo
