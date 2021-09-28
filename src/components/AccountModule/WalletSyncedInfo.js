import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { GU, Link } from '@aragon/ui'
import { useRouting } from '../../routing'
import {
  STATUS_CLIENT_CONNECTION_DROPPED,
  STATUS_CONNECTION_OK,
  STATUS_MAJOR_NETWORK_SLOWDOWN,
  STATUS_NETWORK_SYNC_ISSUES,
  STATUS_TOO_LITTLE_ETH,
  STATUS_WALLET_CONNECTION_DROPPED,
} from './connection-statuses'
import { useWallet } from '../../contexts/wallet'
import { getNetworkFullName, isOnEthMainnet } from '../../util/network'

function WalletSyncedInfo({ header, info, status }) {
  return (
    <React.Fragment>
      {header && (
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
      {status !== STATUS_CONNECTION_OK && (
        <div
          css={`
            margin: ${1 * GU}px 0;
          `}
        >
          <ConnectionInfoMessage connectionStatus={status} />
        </div>
      )}
    </React.Fragment>
  )
}

WalletSyncedInfo.propTypes = {
  header: PropTypes.string,
  info: PropTypes.string,
  status: PropTypes.oneOf([
    STATUS_CLIENT_CONNECTION_DROPPED,
    STATUS_CONNECTION_OK,
    STATUS_MAJOR_NETWORK_SLOWDOWN,
    STATUS_NETWORK_SYNC_ISSUES,
    STATUS_TOO_LITTLE_ETH,
    STATUS_WALLET_CONNECTION_DROPPED,
  ]),
}

function ConnectionInfoMessage({ connectionStatus }) {
  const routing = useRouting()
  const { networkType } = useWallet()
  const networkName = useMemo(() => getNetworkFullName(networkType), [
    networkType,
  ])

  const handleNetworkSettingsClick = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      preferences: { section: 'network' },
    }))
  }, [routing])

  if (connectionStatus === STATUS_WALLET_CONNECTION_DROPPED) {
    return (
      <span>
        We were unable to fetch network information from your wallet. You may
        not be able to send transactions. Please contact your wallet for support
        if this issue persists.
      </span>
    )
  }

  if (
    isOnEthMainnet(networkType) &&
    connectionStatus === STATUS_CLIENT_CONNECTION_DROPPED
  ) {
    return (
      <span>
        We cannot connect to the wallet's Ethereum node. You can change the node
        settings in
        <Link onClick={handleNetworkSettingsClick}>Network Settings.</Link>
        You can also refresh the client.
      </span>
    )
  }

  if (connectionStatus === STATUS_NETWORK_SYNC_ISSUES) {
    return (
      <span>
        Your wallet may not accurately reflect the current state of{' '}
        {networkName}. Please contact your wallet for support if this issue
        persists.
      </span>
    )
  }

  if (connectionStatus === STATUS_MAJOR_NETWORK_SLOWDOWN) {
    return (
      <span>
        The {networkName} may be experiencing a global slowdown. Please avoid
        signing any transactions until this error is resolved.
      </span>
    )
  }

  if (connectionStatus === STATUS_TOO_LITTLE_ETH) {
    return (
      <span>
        You may not have enough ETH in your account to send any transactions.
      </span>
    )
  }

  return null
}

ConnectionInfoMessage.propTypes = {
  connectionStatus: PropTypes.oneOf([
    STATUS_CLIENT_CONNECTION_DROPPED,
    STATUS_CONNECTION_OK,
    STATUS_MAJOR_NETWORK_SLOWDOWN,
    STATUS_NETWORK_SYNC_ISSUES,
    STATUS_TOO_LITTLE_ETH,
    STATUS_WALLET_CONNECTION_DROPPED,
  ]),
}

export default WalletSyncedInfo
