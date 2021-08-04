import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import { useWallet as useWalletBase, UseWalletProvider } from 'use-wallet'
import { getWeb3, filterBalanceValue } from './web3-utils'
import { useWalletConnectors } from './ethereum-providers/connectors'
import { LocalStorageWrapper } from './local-storage-wrapper'
import { NETWORK_TYPE } from './NetworkType'

const NETWORK_TYPE_DEFAULT = NETWORK_TYPE.main

const WalletContext = React.createContext()

function WalletContextProvider({ children }) {
  const {
    account,
    balance,
    ethereum,
    connector,
    status,
    chainId,
    providerInfo,
    type,
    ...walletBaseRest
  } = useWalletBase()

  console.log('========= ', type)

  const [walletWeb3, setWalletWeb3] = useState(null)
  const [networkType, setNetworkType] = useState(NETWORK_TYPE_DEFAULT)

  const connected = useMemo(() => status === 'connected', [status])

  // get web3 and networkType whenever chainId changes
  useEffect(() => {
    let cancel = false

    if (!ethereum) {
      LocalStorageWrapper.setPrefix(NETWORK_TYPE_DEFAULT)
      return
    }

    const walletWeb3 = getWeb3(ethereum)
    setWalletWeb3(walletWeb3)

    walletWeb3.eth.net
      .getNetworkType()
      .then(networkType => {
        if (!cancel) {
          setNetworkType(networkType)
          LocalStorageWrapper.setPrefix(networkType)
        }
        return null
      })
      .catch(() => {
        setNetworkType(NETWORK_TYPE_DEFAULT)
        LocalStorageWrapper.setPrefix(NETWORK_TYPE_DEFAULT)
      })

    return () => {
      cancel = true
      setWalletWeb3(null)
      setNetworkType(NETWORK_TYPE_DEFAULT)
      LocalStorageWrapper.setPrefix(NETWORK_TYPE_DEFAULT)
    }
  }, [ethereum, chainId])

  const wallet = useMemo(
    () => ({
      account,
      balance: new BN(filterBalanceValue(balance)),
      ethereum,
      networkType: connected ? networkType : NETWORK_TYPE_DEFAULT,
      providerInfo: providerInfo,
      web3: walletWeb3,
      status,
      chainId,
      connected,
      ...walletBaseRest,
    }),
    [
      account,
      balance,
      ethereum,
      networkType,
      providerInfo,
      status,
      chainId,
      walletBaseRest,
      walletWeb3,
      connected,
    ]
  )

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  )
}
WalletContextProvider.propTypes = { children: PropTypes.node }

export function WalletProvider({ children }) {
  return (
    <UseWalletProvider connectors={useWalletConnectors}>
      <WalletContextProvider>{children}</WalletContextProvider>
    </UseWalletProvider>
  )
}
WalletProvider.propTypes = { children: PropTypes.node }

export function useWallet() {
  return useContext(WalletContext)
}
