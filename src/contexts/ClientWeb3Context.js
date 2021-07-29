// import React, { useContext, useEffect, useMemo, useState } from 'react'
import React, { useContext, useMemo } from 'react'
import { useWallet } from '../wallet'
import { getWeb3Provider } from '../web3-utils'

const ClientWeb3Context = React.createContext()

/*
function disconnect(web3) {
  if (!web3) {
    return
  }

  if (web3.disconnect) {
    web3.disconnect()
  } else if (web3.connection && web3.connection.close) {
    web3.connection.close()
  }
}
*/

function ClientWeb3Provider(props) {
  const { networkType } = useWallet()
  const web3 = useMemo(() => getWeb3Provider(networkType), [networkType])

  /*  TODO ===> fix this to make it cancel before creating new provider.
  const [web3, setWeb3] = useState()
  useEffect(() => {
    let cancel = false

    if (!cancel) {
      setWeb3(prevWeb3 => {
        // disconnect(prevWeb3)
        return getWeb3Provider(networkType)
      })
    }

    return () => {
      cancel = true
      //disconnect(web3)
    }
  }, [networkType])
 */

  const contextValue = useMemo(() => ({ web3 }), [web3])
  return <ClientWeb3Context.Provider value={contextValue} {...props} />
}

function useClientWeb3() {
  return useContext(ClientWeb3Context)
}

export { ClientWeb3Provider, useClientWeb3 }
