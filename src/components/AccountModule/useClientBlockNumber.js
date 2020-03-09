import React, { useState, useEffect, useContext } from 'react'
import { web3Providers } from '../../environment'
import { pollEvery } from '../../utils'
import { getWeb3 } from '../../web3-utils'

const CLIENT_WEB3 = getWeb3(web3Providers.default)
const CLIENT_BLOCK_POLL_DELAY = 5000

const ClientBlockNumberContext = React.createContext()

export function ClientBlockNumberProvider(props) {
  const [blockNumber, setBlockNumber] = useState(-1)

  useEffect(() => {
    const pollBlockNumber = pollEvery(() => {
      return {
        request: () => CLIENT_WEB3.eth.getBlockNumber(),
        onResult: latestBlockNumber => setBlockNumber(latestBlockNumber),
      }
    }, CLIENT_BLOCK_POLL_DELAY)

    const cleanBlockPoll = pollBlockNumber()

    return () => cleanBlockPoll()
  }, [])

  return <ClientBlockNumberContext.Provider value={blockNumber} {...props} />
}

export function useClientBlockNumber() {
  return useContext(ClientBlockNumberContext)
}
