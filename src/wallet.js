import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import {
  useWallet as useWalletBase,
  UseWalletProvider,
  ChainUnsupportedError,
} from 'use-wallet'
import { getWeb3, filterBalanceValue } from './web3-utils'
import { useWalletConnectors } from './ethereum-providers/connectors'
import { LocalStorageWrapper } from './local-storage-wrapper'
import { NETWORK_TYPE } from './NetworkType'

export const WALLET_STATUS = Object.freeze({
  providers: 'providers',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  error: 'error',
})

const NETWORK_TYPE_DEFAULT = NETWORK_TYPE.main
const CHAIN_ID_DEFAULT = 1

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
    networkName,
    ...walletBaseRest
  } = useWalletBase()

  const [walletWeb3, setWalletWeb3] = useState(null)

  const connected = useMemo(() => status === 'connected', [status])
  const networkType = useMemo(
    () => (connected ? networkName : NETWORK_TYPE_DEFAULT),
    [connected, networkName]
  )

  // get web3 and networkType whenever chainId changes
  useEffect(() => {
    let cancel = false

    if (!ethereum) {
      LocalStorageWrapper.setPrefix(NETWORK_TYPE_DEFAULT)
      return
    }

    const walletWeb3 = getWeb3(ethereum)
    if (!cancel) {
      setWalletWeb3(walletWeb3)
      LocalStorageWrapper.setPrefix(networkType)
    }

    return () => {
      cancel = true
      setWalletWeb3(null)
      LocalStorageWrapper.setPrefix(NETWORK_TYPE_DEFAULT)
    }
  }, [ethereum, networkType])

  const wallet = useMemo(
    () => ({
      account,
      balance: new BN(filterBalanceValue(balance)),
      ethereum,
      networkType,
      providerInfo: providerInfo,
      web3: walletWeb3,
      status,
      chainId: connected ? chainId : CHAIN_ID_DEFAULT,
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

export { ChainUnsupportedError }
