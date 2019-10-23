import React from 'react'
import PropTypes from 'prop-types'
import { useAccount } from '../../account'
import { NoWeb3Provider, AccountLocked, WrongNetwork } from './Web3Errors'

const ValidateWalletWeb3 = ({
  children,
  hasWeb3,
  intent,
  isTransaction,
  networkType,
  onClose,
  onRequestEnable,
  walletNetworkType,
  walletProviderId,
}) => {
  const { connected } = useAccount()

  if (!hasWeb3) {
    return <NoWeb3Provider intent={intent} onClose={onClose} />
  }

  if (!connected) {
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

  return children
}

ValidateWalletWeb3.propTypes = {
  children: PropTypes.node.isRequired,
  hasWeb3: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  isTransaction: PropTypes.bool.isRequired,
  networkType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestEnable: PropTypes.func.isRequired,
  walletNetworkType: PropTypes.string.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export default ValidateWalletWeb3
