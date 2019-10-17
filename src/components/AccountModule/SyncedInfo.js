import React, { useState, useEffect } from 'react'

import { getWeb3Instances } from './utils'

const SyncedInfo = () => {
  const [lastBlockIndex, setLastBlockIndex] = useState()

  useEffect(() => {
    const { walletWeb3 } = getWeb3Instances()

    async function getLastBlockNumber() {
      const latest = await walletWeb3.eth.getBlockNumber()
      setLastBlockIndex(latest)
    }
    getLastBlockNumber()
  }, [])

  return (
    <div
      css={`
        margin-top: 10px;
      `}
    >
      <span
        css={`
          padding-right: 10px;
          opacity: 0.8;
        `}
      >
        Synced:
      </span>
      <span>current block: {lastBlockIndex || '…'}</span>
    </div>
  )
}

export default SyncedInfo
