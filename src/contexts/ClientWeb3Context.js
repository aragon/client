import React, { useContext, useMemo } from 'react'
import { useWallet } from '../contexts/wallet'
import { web3Provider } from '../Web3Provider'

const ClientWeb3Context = React.createContext()

function ClientWeb3Provider(props) {
  const { networkType } = useWallet()

  const contextValue = useMemo(
    () => ({
      web3: web3Provider.getProvider(networkType),
    }),
    [networkType]
  )

  return <ClientWeb3Context.Provider value={contextValue} {...props} />
}

function useClientWeb3() {
  return useContext(ClientWeb3Context)
}

export { ClientWeb3Provider, useClientWeb3 }
