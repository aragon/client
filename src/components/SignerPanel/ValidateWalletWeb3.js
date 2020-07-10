import React from 'react'
import PropTypes from 'prop-types'
import { useWallet } from '../../wallet'
import { NoWeb3Provider, AccountLocked } from './Web3Errors'

function ValidateWalletWeb3({
  children,
  hasWallet,
  intent,
  isTransaction,
  onClose,
  walletProviderId,
}) {
  const wallet = useWallet()

  if (!hasWallet) {
    return <NoWeb3Provider intent={intent} onClose={onClose} />
  }

  if (!wallet.connected) {
    return (
      <AccountLocked
        intent={intent}
        onClose={onClose}
        walletProviderId={walletProviderId}
      />
    )
  }

  return children
}

ValidateWalletWeb3.propTypes = {
  children: PropTypes.node.isRequired,
  hasWallet: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  isTransaction: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export default ValidateWalletWeb3
