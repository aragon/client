import React from 'react'
import { AccountLocked, NoWeb3Provider, WrongNetwork } from './Web3Errors'
import { network } from '../../environment'
import { useWallet } from '../../wallet'

function useWalletError({ intent, isTransaction }) {
  const wallet = useWallet()
  const { connected, web3, networkType: walletNetworkType } = wallet
  const networkType = network.type
  const hasWeb3 = Boolean(web3)
  const walletProviderId = wallet.providerInfo.id

  if (!hasWeb3) {
    return modalProps => (
      <NoWeb3Provider intent={intent} onClose={modalProps.closeModal} />
    )
  }

  if (!connected) {
    return modalProps => (
      <AccountLocked
        intent={intent}
        onClose={modalProps.closeModal}
        walletProviderId={walletProviderId}
      />
    )
  }

  if (isTransaction && walletNetworkType !== networkType) {
    return modalProps => (
      <WrongNetwork
        intent={intent}
        onClose={modalProps.closeModal}
        networkType={networkType}
        walletProviderId={walletProviderId}
      />
    )
  }

  return false
}

export default useWalletError
