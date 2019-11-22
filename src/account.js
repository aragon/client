import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import { getProvider } from './ethereum-providers'
import { useLocalIdentity } from './hooks'
import { EthereumAddressType } from './prop-types'
import { enableWallet } from './wallet-utils'

// Everything related to the user account and its connected status.
const AccountManagerContext = React.createContext({})

function AccountProvider({
  account,
  balance,
  children,
  isContract,
  walletNetwork,
  walletProviderId,
}) {
  return (
    <AccountManagerContext.Provider
      value={{
        account,
        balance,
        isContract,
        walletNetwork,
        walletProviderId,
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  )
}
AccountProvider.propTypes = {
  account: EthereumAddressType,
  balance: PropTypes.instanceOf(BN),
  children: PropTypes.node,
  isContract: PropTypes.bool,
  walletNetwork: PropTypes.string,
  walletProviderId: PropTypes.string,
}

function useAccount() {
  const {
    account,
    balance,
    isContract,
    walletNetwork,
    walletProviderId,
  } = useContext(AccountManagerContext)

  const { name: label } = useLocalIdentity(account)

  return {
    balance,
    isContract,
    label,
    address: account,
    connected: Boolean(account),
    enable: enableWallet,
    networkId: walletNetwork,
    providerInfo: getProvider(walletProviderId),
  }
}

export { AccountProvider, useAccount }
