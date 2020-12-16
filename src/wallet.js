import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import { useWallet as useWalletBase, UseWalletProvider } from 'use-wallet'
import { getFortmaticApiKey, getPortisDappId } from './local-settings'
import { getProviderFromUseWalletId } from './ethereum-providers'
import { network } from './environment'
import { getWeb3, filterBalanceValue } from './web3-utils'
import { getWalletConnectRPC } from './network-config'

const NETWORK_TYPE_DEFAULT = 'private'

const WalletContext = React.createContext()

function WalletContextProvider({ children }) {
  const {
    account,
    balance,
    ethereum,
    activated,
    activating,
    ...walletBaseRest
  } = useWalletBase()

  const [walletWeb3, setWalletWeb3] = useState(null)
  const [networkType, setNetworkType] = useState(NETWORK_TYPE_DEFAULT)

  useEffect(() => {
    let cancel = false

    if (!ethereum) {
      return
    }

    const walletWeb3 = getWeb3(ethereum)
    setWalletWeb3(walletWeb3)

    walletWeb3.eth.net
      .getNetworkType()
      .then(networkType => {
        if (!cancel) {
          setNetworkType(networkType)
        }
        return null
      })
      .catch(() => {
        setNetworkType(NETWORK_TYPE_DEFAULT)
      })

    return () => {
      cancel = true
      setWalletWeb3(null)
      setNetworkType(NETWORK_TYPE_DEFAULT)
    }
  }, [account, ethereum])

  const wallet = useMemo(
    () => ({
      account,
      balance: new BN(filterBalanceValue(balance)),
      ethereum,
      networkType,
      providerInfo: getProviderFromUseWalletId(activated),
      web3: walletWeb3,
      ...walletBaseRest,
    }),
    [
      activated,
      account,
      balance,
      ethereum,
      networkType,
      walletBaseRest,
      walletWeb3,
    ]
  )

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  )
}
WalletContextProvider.propTypes = { children: PropTypes.node }

export function WalletProvider({ children }) {
  return (
    <UseWalletProvider
      chainId={network.chainId}
      connectors={{
        fortmatic: { apiKey: getFortmaticApiKey() },
        portis: { dAppId: getPortisDappId() },
        provided: { provider: window.cleanEthereum },
        walletconnect: { rpcUrl: getWalletConnectRPC(network.chainId) },
      }}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </UseWalletProvider>
  )
}
WalletProvider.propTypes = { children: PropTypes.node }

export function useWallet() {
  return useContext(WalletContext)
}
