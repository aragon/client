import { useState, useEffect } from 'react'

import { web3Providers, network } from '../../environment'
import { getNetworkByChainId } from '../../network-config'
import { getWeb3 } from '../../web3-utils'

export async function getLatestBlockTimestamp() {
  const clientWeb3 = getWeb3(web3Providers.default)
  const latestBlockInfo = await clientWeb3.eth.getBlock('latest')
  if (!latestBlockInfo) {
    return 0 // we should have a retry mechanism
  }
  return latestBlockInfo.timestamp
}

function normalizeNetworkName(chainId) {
  return getNetworkByChainId(chainId).settings.shortName
}

export const useNetworkConnectionData = () => {
  const [walletChainId, setWalletChainId] = useState(-1)
  const clientChainId = network.chainId

  useEffect(() => {
    const walletWeb3 = getWeb3(web3Providers.wallet)
    walletWeb3.eth.getChainId((err, chainId) => {
      if (!err) {
        setWalletChainId(chainId)
      }
    })
  }, [])

  return {
    walletNetworkName: normalizeNetworkName(walletChainId),
    clientNetworkName: normalizeNetworkName(clientChainId),
    hasNetworkMismatch: walletChainId !== -1 && walletChainId !== clientChainId,
  }
}

export function getSyncInfo(latestBlockTimestamp) {
  const blockDiff = new Date() - new Date(latestBlockTimestamp * 1000)
  const latestBlockDifference = Math.floor(blockDiff / 1000 / 60)

  if (latestBlockDifference > 45) {
    return {
      connectionType: 'dropped',
      syncHeader: '',
      syncInfo: '',
    }
  } else if (latestBlockDifference >= 30) {
    return {
      connectionType: 'error',
      syncHeader: 'Last known state: ',
      syncInfo: `${latestBlockDifference} min behind`,
    }
  } else if (latestBlockDifference >= 3) {
    return {
      connectionType: 'warning',
      syncHeader: 'Out of sync: ',
      syncInfo: `${latestBlockDifference} min behind`,
    }
  }
  return {
    connectionType: 'healthy',
    syncHeader: 'Synced:',
    syncInfo: 'current block:',
  }
}
