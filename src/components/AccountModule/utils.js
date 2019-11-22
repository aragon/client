import { useState, useEffect } from 'react'

import { web3Providers } from '../../environment'
import { getNetworkByChainId } from '../../network-config'
import { getWeb3 } from '../../web3-utils'

export const getWeb3Instances = () => {
  const walletWeb3 = getWeb3(web3Providers.wallet)
  const web3 = getWeb3(web3Providers.default)
  return {
    walletWeb3,
    web3,
  }
}

function normalizeNetworkName(chainId) {
  return getNetworkByChainId(chainId).settings.shortName
}

export const useNetworkConnectionData = () => {
  const [walletChainId, setWalletChainId] = useState()
  const [clientChainId, setClientChainId] = useState()

  useEffect(() => {
    const { web3, walletWeb3 } = getWeb3Instances()
    web3.eth.getChainId((err, chainId) => {
      if (!err) {
        setClientChainId(chainId)
      }
    })
    walletWeb3.eth.getChainId((err, chainId) => {
      if (!err) {
        setWalletChainId(chainId)
      }
    })
  }, [])

  return {
    walletNetworkName: normalizeNetworkName(walletChainId),
    clientNetworkName: normalizeNetworkName(clientChainId),
    hasNetworkMismatch:
      walletChainId !== undefined &&
      clientChainId !== undefined &&
      walletChainId !== clientChainId,
  }
}
