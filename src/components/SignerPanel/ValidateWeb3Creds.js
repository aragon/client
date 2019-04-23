import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { isElectron } from '../../utils'
import { NoWeb3Provider, AccountLocked, WrongNetwork } from './Web3Errors'

const ValidateWeb3Creds = ({
  children,
  hasAccount,
  hasWeb3,
  intent,
  isTransaction,
  networkType,
  onClose,
  onRequestEnable,
  walletNetworkType,
  walletProviderId,
}) => {
  if (!hasWeb3) {
    return (
      <NoWeb3Provider
        intent={intent}
        isElectron={isElectron()}
        onClose={onClose}
      />
    )
  }

  if (!hasAccount) {
    return (
      <AccountLocked
        intent={intent}
        onClose={onClose}
        onRequestEnable={onRequestEnable}
        walletProviderId={walletProviderId}
      />
    )
  }

  if (isTransaction && walletNetworkType !== networkType) {
    return (
      <WrongNetwork
        intent={intent}
        onClose={onClose}
        networkType={networkType}
        walletProviderId={walletProviderId}
      />
    )
  }
  return <Fragment>{children}</Fragment>
}

ValidateWeb3Creds.propTypes = {
  children: PropTypes.node.isRequired,
  hasAccount: PropTypes.bool.isRequired,
  hasWeb3: PropTypes.bool.isRequired,
  intent: PropTypes.object,
  isTransaction: PropTypes.bool.isRequired,
  networkType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestEnable: PropTypes.func,
  walletNetworkType: PropTypes.string.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export default ValidateWeb3Creds
