import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { useWalletBlockNumber } from '../../wallet'
import { resolveUserSyncInfo } from './utils'

function WalletSyncedInfo({
  clientListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay,
  walletListening,
}) {
  const walletBlockNumber = useWalletBlockNumber()
  const userSyncInfo = resolveUserSyncInfo(
    clientListening,
    walletListening,
    clientOnline,
    clientSyncDelay,
    walletSyncDelay,
    walletBlockNumber
  )

  return (
    <React.Fragment>
      {userSyncInfo.header && (
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
            {userSyncInfo.header}
          </span>
          <span>{userSyncInfo.info}</span>
        </div>
      )}
      {userSyncInfo.message && (
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          {userSyncInfo.message}
        </div>
      )}
    </React.Fragment>
  )
}

WalletSyncedInfo.propTypes = {
  clientListening: PropTypes.bool,
  clientOnline: PropTypes.bool,
  clientSyncDelay: PropTypes.number,
  walletListening: PropTypes.bool,
  walletSyncDelay: PropTypes.number,
}

export default WalletSyncedInfo
