import { useState, useEffect } from 'react'
import { useTheme, useToast } from '@aragon/ui'
import * as clipboard from 'clipboard-polyfill'

import { web3Providers } from '../../environment'
import { getWeb3 } from '../../web3-utils'

export const getWeb3Instances = () => {
  const walletWeb3 = getWeb3(web3Providers.wallet)
  const web3 = getWeb3(web3Providers.default)
  return {
    walletWeb3,
    web3,
  }
}

const normaliseNetworkName = networkId =>
  ({
    '1': 'Main',
    '3': 'Ropsten',
    '4': 'Rinkeby',
  }[networkId] || networkId)

export const useNetworkConnectionData = () => {
  const [walletNetworkId, setWalletNetworkId] = useState()
  const [clientNetworkId, setClientNetworkId] = useState()

  useEffect(() => {
    const { web3, walletWeb3 } = getWeb3Instances()
    web3.eth.net.getId((err, networkId) => {
      if (!err) {
        setClientNetworkId(networkId)
      }
    })
    walletWeb3.eth.net.getId((err, networkId) => {
      if (!err) {
        setWalletNetworkId(networkId)
      }
    })
  }, [])

  return {
    walletNetworkName: normaliseNetworkName(walletNetworkId),
    clientNetworkName: normaliseNetworkName(clientNetworkId),
    hasNetworkMismatch:
      walletNetworkId !== undefined &&
      clientNetworkId !== undefined &&
      walletNetworkId !== clientNetworkId,
  }
}

export const useConnectionColor = () => {
  const theme = useTheme()
  const { hasNetworkMismatch } = useNetworkConnectionData()

  return hasNetworkMismatch ? theme.negative : theme.positive
}

export const useCopyToClipboard = (payload, toastText) => {
  const toast = useToast()
  return () => {
    clipboard.writeText(payload)
    toastText && toast(toastText)
  }
}
