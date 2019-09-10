import React, { useContext } from 'react'
import { enableWallet } from './wallet-utils'
import { useLocalIdentity } from './hooks'
import { getProvider } from './ethereum-providers'

// Everything related to the user account and its connected status.
const AccountManagerContext = React.createContext({})

function AccountProvider({
  account,
  children,
  walletNetwork,
  walletProviderId,
}) {
  return (
    <AccountManagerContext.Provider
      value={{
        account,
        walletNetwork,
        walletProviderId,
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  )
}

function useAccount() {
  const { account, walletNetwork, walletProviderId } = useContext(
    AccountManagerContext
  )
  const { name: label } = useLocalIdentity(account)

  return {
    isContract: false,
    connected: Boolean(account),
    address: account,
    label,
    enable: enableWallet,
    networkId: walletNetwork,
    providerInfo: getProvider(walletProviderId),
  }
}

export { AccountProvider, useAccount }
