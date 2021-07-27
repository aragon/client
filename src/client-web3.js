import React, { useContext, useMemo } from 'react'
import { useWallet } from './wallet'
import { getWeb3Provider } from './web3-utils'

const ClientWeb3Context = React.createContext()

function ClientWeb3Provider(props) {
  const { networkType } = useWallet()
  const clientWeb3 = useMemo(() => getWeb3Provider(networkType), [networkType])

  return <ClientWeb3Context.Provider value={clientWeb3} {...props} />
}

function useClientWeb3() {
  return useContext(ClientWeb3Context)
}

export { ClientWeb3Provider, useClientWeb3 }
