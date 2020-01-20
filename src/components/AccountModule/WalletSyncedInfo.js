import React from 'react'
import PropTypes from 'prop-types'
import { GU, Link } from '@aragon/ui'
import { getAppPath, getPreferencesSearch } from '../../routing'
import { useWalletBlockNumber } from '../../wallet'
import {
  getWalletSyncState,
  STATUS_CLIENT_CONNECTION_DROPPED,
  STATUS_CONNECTION_OK,
  STATUS_MAJOR_NETWORK_SLOWDOWN,
  STATUS_NETWORK_SYNC_ISSUES,
  STATUS_WALLET_CONNECTION_DROPPED,
} from './utils'

function WalletSyncedInfo({
  clientListening,
  clientOnline,
  clientSyncDelay,
  walletSyncDelay,
  walletListening,
}) {
  const walletBlockNumber = useWalletBlockNumber()
  const walletSyncInfo = getWalletSyncState(
    clientListening,
    walletListening,
    clientOnline,
    clientSyncDelay,
    walletSyncDelay,
    walletBlockNumber
  )

  return (
    <React.Fragment>
      {walletSyncInfo.header && (
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
            {walletSyncInfo.header}
          </span>
          <span>{walletSyncInfo.info}</span>
        </div>
      )}
      {walletSyncInfo.message !== STATUS_CONNECTION_OK && (
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          <ConnectionInfoMessage connectionStatus={walletSyncInfo.message} />
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

function ConnectionInfoMessage({ connectionStatus }) {
  let content = null
  if (connectionStatus === STATUS_WALLET_CONNECTION_DROPPED) {
    content = (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link
          onClick={() =>
            (window.location.hash = getAppPath({
              search: getPreferencesSearch('network'),
            }))
          }
        >
          Network Settings.
        </Link>
        You will still see new transactions from the client appear.
      </span>
    )
  }

  if (connectionStatus === STATUS_CLIENT_CONNECTION_DROPPED) {
    content = (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link
          onClick={() =>
            (window.location.hash = getAppPath({
              search: getPreferencesSearch('network'),
            }))
          }
        >
          Network Settings.
        </Link>
        You can also refresh the client.
      </span>
    )
  }

  if (connectionStatus === STATUS_NETWORK_SYNC_ISSUES) {
    content = (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link
          onClick={() =>
            (window.location.hash = getAppPath({
              search: getPreferencesSearch('network'),
            }))
          }
        >
          Network Settings.
        </Link>
      </span>
    )
  }

  if (connectionStatus === STATUS_MAJOR_NETWORK_SLOWDOWN) {
    content = (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link
          onClick={() =>
            (window.location.hash = getAppPath({
              search: getPreferencesSearch('network'),
            }))
          }
        >
          Network Settings.
        </Link>
        Do not sign any transactions until this error disappears.
      </span>
    )
  }

  return (
    content && (
      <div
        css={`
          margin-top: ${GU}px;
          margin-bottom: ${GU}px;
        `}
      >
        {content}
      </div>
    )
  )
}

export default WalletSyncedInfo
