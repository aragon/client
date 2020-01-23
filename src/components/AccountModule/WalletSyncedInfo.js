import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, Link } from '@aragon/ui'
import { network } from '../../environment'
import { getAppPath, getPreferencesSearch } from '../../routing'
import { useWalletBlockNumber } from '../../wallet'
import { useWalletSyncState } from './useWalletSyncState'
import {
  STATUS_CLIENT_CONNECTION_DROPPED,
  STATUS_CONNECTION_OK,
  STATUS_MAJOR_NETWORK_SLOWDOWN,
  STATUS_NETWORK_SYNC_ISSUES,
  STATUS_TOO_LITTLE_ETH,
  STATUS_WALLET_CONNECTION_DROPPED,
} from './connection-statuses'

function WalletSyncedInfo({
  clientListening,
  clientOnline,
  clientSyncDelay,
  locator,
  walletSyncDelay,
  walletListening,
}) {
  const walletBlockNumber = useWalletBlockNumber()
  const walletSyncInfo = useWalletSyncState(
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
          <ConnectionInfoMessage
            connectionStatus={walletSyncInfo.message}
            locator={locator}
          />
        </div>
      )}
    </React.Fragment>
  )
}

WalletSyncedInfo.propTypes = {
  clientListening: PropTypes.bool,
  clientOnline: PropTypes.bool,
  clientSyncDelay: PropTypes.number,
  locator: PropTypes.object,
  walletListening: PropTypes.bool,
  walletSyncDelay: PropTypes.number,
}

function ConnectionInfoMessage({ connectionStatus, locator }) {
  const handleNetworkSettingsClick = useCallback(() => {
    window.location.hash = getAppPath({
      dao: locator.dao || '',
      search: getPreferencesSearch('network'),
    })
  }, [locator])

  let content = null

  if (connectionStatus === STATUS_WALLET_CONNECTION_DROPPED) {
    content = (
      <span>
        We were unable to fetch network information from your wallet. You may
        not be able to send transactions. Please contact your wallet for support
        if this issue persists.
      </span>
    )
  }

  if (connectionStatus === STATUS_CLIENT_CONNECTION_DROPPED) {
    content = (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link onClick={handleNetworkSettingsClick}>Network Settings.</Link>
        You can also refresh the client.
      </span>
    )
  }

  if (connectionStatus === STATUS_NETWORK_SYNC_ISSUES) {
    content = (
      <span>
        Your wallet may not accurately reflect the current state of Ethereum's
        {network.name}. Please contact your wallet for support if this issue
        persists.
      </span>
    )
  }

  if (connectionStatus === STATUS_MAJOR_NETWORK_SLOWDOWN) {
    content = (
      <span>
        The Ethereum {network.name} may be experiencing a global slowdown.
        Please avoid signing any transactions until this error is resolved.
      </span>
    )
  }

  if (connectionStatus === STATUS_TOO_LITTLE_ETH) {
    content = (
      <span>
        You may not have enough ETH in your account to send any transactions.
      </span>
    )
  }

  return (
    content && (
      <div
        css={`
          margin-top: ${1 * GU}px;
          margin-bottom: ${1 * GU}px;
        `}
      >
        {content}
      </div>
    )
  )
}

ConnectionInfoMessage.propTypes = {
  connectionStatus: PropTypes.oneOf([
    'Symbol(STATUS_CLIENT_CONNECTION_DROPPED)',
  ]),
  locator: PropTypes.object,
}

export default WalletSyncedInfo
