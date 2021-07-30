import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useWallet } from '../wallet'
import { getWeb3Provider } from '../web3-utils'

const ClientWeb3Context = React.createContext()

function disconnect(web3) {
  if (!web3) {
    return
  }

  if(!web3.connected){
    return
  }

  if (web3.disconnect) {
    web3.disconnect()
  } else if (web3.connection && web3.connection.close) {
    web3.connection.close()
  }
}


function ClientWeb3Provider(props) {
  const { networkType } = useWallet()

  const [web3, setWeb3] = useState(null)

  useEffect(() => {
      setWeb3(prevWeb3 => {
        disconnect(prevWeb3)
        return getWeb3Provider(networkType)
      })
    
  }, [networkType])
 

  const contextValue = useMemo(() => ({ 
    web3: web3 || getWeb3Provider()
   }), [web3])
  return <ClientWeb3Context.Provider value={contextValue} {...props} />
}

function useClientWeb3() {
  return useContext(ClientWeb3Context)
}

export { ClientWeb3Provider, useClientWeb3 }
