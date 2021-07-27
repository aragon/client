import React, { useState, useEffect, useContext } from 'react'
import { useClientWeb3 } from '../../client-web3'
import { getWeb3 } from '../../web3-utils'
import { pollEvery } from '../../utils'

const CLIENT_BLOCK_POLL_DELAY = 5000

const ClientBlockNumberContext = React.createContext()
export function ClientBlockNumberProvider(props) {
  const [blockNumber, setBlockNumber] = useState(-1)
  const clientWeb3 = useClientWeb3()
  const web3 = getWeb3(clientWeb3)

  useEffect(() => {
    const pollBlockNumber = pollEvery(() => {
      return {
        request: () => web3.eth.getBlockNumber(),
        onResult: latestBlockNumber => setBlockNumber(latestBlockNumber),
      }
    }, CLIENT_BLOCK_POLL_DELAY)

    const cleanBlockPoll = pollBlockNumber()

    return () => cleanBlockPoll()
  }, [web3])

  return <ClientBlockNumberContext.Provider value={blockNumber} {...props} />
}

export function useClientBlockNumber() {
  return useContext(ClientBlockNumberContext)
}
