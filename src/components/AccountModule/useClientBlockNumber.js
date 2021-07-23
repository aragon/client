import React, { useState, useEffect, useContext } from 'react'
import { pollEvery } from '../../utils'
import { useWeb3 } from '../../web3-utils'

const CLIENT_BLOCK_POLL_DELAY = 5000

const ClientBlockNumberContext = React.createContext()

export function ClientBlockNumberProvider(props) {
  const [blockNumber, setBlockNumber] = useState(-1)
  const web3 = useWeb3()

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
