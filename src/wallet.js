import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import BN from 'bn.js'
import { useWallet as useWalletBase, UseWalletProvider } from 'use-wallet'
import { getFortmaticApiKey, getPortisDappId } from './local-settings'
import { getProviderFromUseWalletId } from './ethereum-providers'
import { getWeb3, filterBalanceValue } from './web3-utils'

const NETWORK_TYPE_DEFAULT = 'main'
const SUPPORTED_CHAIN_IDS = [1, 4]

const WalletContext = React.createContext()

function WalletContextProvider({ children }) {
  const {
    account,
    balance,
    ethereum,
    connector,
    status,
    chainId,
    ...walletBaseRest
  } = useWalletBase()

  const [walletWeb3, setWalletWeb3] = useState(null)
  const [networkType, setNetworkType] = useState(NETWORK_TYPE_DEFAULT)

  // get web3 and networkType whenever chainId changes
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
  }, [ethereum, chainId])

  const wallet = useMemo(
    () => ({
      account,
      balance: new BN(filterBalanceValue(balance)),
      ethereum,
      networkType: status === 'connected' ? networkType : 'main',
      providerInfo: getProviderFromUseWalletId(connector),
      web3: walletWeb3,
      status,
      chainId,
      connected: status === 'connected',
      ...walletBaseRest,
    }),
    [
      account,
      balance,
      ethereum,
      networkType,
      status,
      chainId,
      connector,
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
      connectors={{
        fortmatic: {
          apiKey: getFortmaticApiKey(),
          chainId: 1,
        },
        frame: { chainId: SUPPORTED_CHAIN_IDS },
        portis: { dAppId: getPortisDappId(), chainId: SUPPORTED_CHAIN_IDS },
        injected: { chainId: SUPPORTED_CHAIN_IDS },
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
