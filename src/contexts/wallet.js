import React, {
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import {
  useWallet as useWalletBase,
  UseWalletProvider,
  ChainUnsupportedError,
  chains,
} from 'use-wallet'
import { getWeb3, filterBalanceValue } from '../util/web3'
import { useWalletConnectors } from '../ethereum-providers/connectors'
import { useAPM, updateAPMContext } from './elasticAPM'
import { LocalStorageWrapper } from '../local-storage-wrapper'

export const WALLET_STATUS = Object.freeze({
  providers: 'providers',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  error: 'error',
})

// default network is mainnet if user is not connected
const NETWORK_TYPE_DEFAULT = chains.getChainInformation(1)?.type

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

  const initialNetwork = useMemo(() => {
    const lastNetwork = LocalStorageWrapper.get('last-network', false)
    if (!lastNetwork) return NETWORK_TYPE_DEFAULT
    return lastNetwork
  }, [])

  const [walletWeb3, setWalletWeb3] = useState(null)
  const [disconnectedNetworkType, setDisconnectedNetworkType] = useState(
    initialNetwork
  )

  const connected = useMemo(() => status === 'connected', [status])
  const networkType = useMemo(() => {
    const newNetwork = connected ? networkName : disconnectedNetworkType
    LocalStorageWrapper.set('last-network', newNetwork, false)
    return newNetwork
  }, [connected, networkName, disconnectedNetworkType])

  const changeNetworkTypeDisconnected = useCallback(
    newNetworkType => {
      if (status === 'disconnected') {
        setDisconnectedNetworkType(newNetworkType)
      }
    },
    [status]
  )

  // get web3 and set local storage prefix whenever networkType changes
  useEffect(() => {
    let cancel = false

    if (!ethereum) {
      return
    }

    const walletWeb3 = getWeb3(ethereum)
    if (!cancel) {
      setWalletWeb3(walletWeb3)
    }

    return () => {
      cancel = true
      setWalletWeb3(null)
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
      chainId: connected ? chainId : 1, // connect to mainnet if wallet is not connected
      connected,
      changeNetworkTypeDisconnected,
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
      changeNetworkTypeDisconnected,
    ]
  )

  const { apm } = useAPM()
  useEffect(() => {
    updateAPMContext(apm, wallet.networkType)
  }, [apm, wallet.networkType])

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  )
}
WalletContextProvider.propTypes = { children: PropTypes.node }

export function WalletProvider({ children }) {
  return (
    <UseWalletProvider connectors={useWalletConnectors} autoConnect>
      <WalletContextProvider>{children}</WalletContextProvider>
    </UseWalletProvider>
  )
}
WalletProvider.propTypes = { children: PropTypes.node }

export function useWallet() {
  return useContext(WalletContext)
}

export { ChainUnsupportedError }
