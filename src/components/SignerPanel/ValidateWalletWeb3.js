import React from 'react'
import PropTypes from 'prop-types'
import { useWallet } from '../../contexts/wallet'
import { NoWeb3Provider, AccountLocked } from './Web3Errors'

function ValidateWalletWeb3({
  children,
  hasWeb3,
  intent,
  onClose,
  walletProviderId,
}) {
  const wallet = useWallet()

  if (!hasWeb3) {
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
  hasWeb3: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export default ValidateWalletWeb3
