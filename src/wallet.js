import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import {
  useWallet as useWalletBase,
  UseWalletProvider,
  ChainUnsupportedError,
  KNOWN_CHAINS,
} from 'use-wallet'
import { getWeb3, filterBalanceValue } from './web3-utils'
import { useWalletConnectors } from './ethereum-providers/connectors'
import { LocalStorageWrapper } from './local-storage-wrapper'

export const WALLET_STATUS = Object.freeze({
  providers: 'providers',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  error: 'error',
})

const CHAIN_ID_MAINNET = 1
const NETWORK_TYPE_DEFAULT = KNOWN_CHAINS.get(CHAIN_ID_MAINNET)

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
    () => (status === 'connected' ? networkName : NETWORK_TYPE_DEFAULT),
    [status, networkName]
  )

  // get web3 and set local storage prefix whenever networkType changes
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
      chainId: connected ? chainId : CHAIN_ID_MAINNET,
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

export { ChainUnsupportedError, KNOWN_CHAINS, CHAIN_ID_MAINNET }
