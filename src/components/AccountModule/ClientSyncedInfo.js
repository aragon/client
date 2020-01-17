import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { useClientBlockNumber } from './useClientBlockNumber'

function ClientSyncedInfo({ syncDelay, listening, online }) {
  const [correctSyncInfo, setCorrectSyncInfo] = useState({
    header: '',
    info: '',
  })
  const latestClientBlockNumber = useClientBlockNumber()
  useEffect(() => {
    if (syncDelay >= 45) {
      setCorrectSyncInfo({ header: '', info: '' })
    } else if (syncDelay >= 30) {
      setCorrectSyncInfo({
        header: 'Last known state: ',
        info: `${syncDelay} min behind`,
      })
    } else if (syncDelay >= 3) {
      setCorrectSyncInfo({
        header: 'Out of sync: ',
        info: `${syncDelay} min behind`,
      })
    } else {
      console.log(listening, online)
      setCorrectSyncInfo({
        header: 'Synced: ',
        info: `current block ${latestClientBlockNumber}`,
      })
    }
  }, [syncDelay, latestClientBlockNumber, listening, online])

  return listening && online && syncDelay < 45 ? (
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
        {correctSyncInfo.header}
      </span>
      <span>{correctSyncInfo.info}</span>
    </div>
  ) : null
}

ClientSyncedInfo.propTypes = {
  listening: PropTypes.bool,
  online: PropTypes.bool,
  syncDelay: PropTypes.number,
}

export default ClientSyncedInfo
