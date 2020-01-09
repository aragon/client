import React, { useContext, useEffect, useState } from 'react'
import { web3Providers } from './environment'
import { identifyProvider, getProvider } from './ethereum-providers'
import { pollEvery } from './utils'
import {
  getAccountBalance,
  getIsContractAccount,
  getMainAccount,
  getUnknownBalance,
  getWeb3,
} from './web3-utils'

const WALLET_WEB3 = getWeb3(web3Providers.wallet)
const WALLET_PROVIDER_INFO = getProvider(identifyProvider(web3Providers.wallet))
const WALLET_POLL_DELAY = 2000
const WALLET_BLOCK_POLL_DELAY = 5000

const NO_WALLET = {
  account: null,
  balance: getUnknownBalance(),
  chainId: -1,
  enable: enableWallet,
  isConnected: false,
  isContract: false,
  networkType: 'private',
  providerInfo: WALLET_PROVIDER_INFO,
  web3: WALLET_WEB3,
}

// Enable the web3 provider. There is no way to reliably know the enabled
// state of a provider, so we assume that if there is a provider but no
// account, the provider is locked and / or not enabled.
export function enableWallet() {
  const provider = web3Providers.wallet

  if (!provider) {
    return
  }

  // For providers supporting .enable() (EIP 1102 draft).
  if (typeof provider.enable === 'function') {
    provider.enable()
    return
  }

  // For providers supporting EIP 1102 (final).
  if (typeof provider.send === 'function') {
    // Some providers (Metamask) don’t return a promise as defined in EIP
    // 1102, so we can’t rely on it to know the connected accounts.
    provider.send('eth_requestAccounts')
  }
}

// Keep polling the main account from the wallet.
// See https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
export const pollWallet = pollEvery(onUpdate => {
  let lastWallet = NO_WALLET

  const hasChanged = wallet =>
    !(
      wallet.account === lastWallet.account &&
      wallet.balance.eq(lastWallet.balance) &&
      wallet.chainId === lastWallet.chainId &&
      wallet.isConnected === lastWallet.isConnected &&
      wallet.isContract === lastWallet.isContract &&
      wallet.networkType === lastWallet.networkType
    )

  return {
    request: async () => {
      try {
        const [
          { account, balance, isContract },
          chainId,
          networkType,
        ] = await Promise.all([
          getMainAccount(WALLET_WEB3).then(async account => {
            if (!account) {
              throw new Error('no account')
            }
            const [balance, isContract] = await Promise.all([
              getAccountBalance(WALLET_WEB3, account),
              getIsContractAccount(WALLET_WEB3, account),
            ])
            return { account, balance, isContract }
          }),
          WALLET_WEB3.eth.getChainId(),
          WALLET_WEB3.eth.net.getNetworkType(),
        ])

        return {
          ...NO_WALLET,
          account,
          balance,
          chainId,
          isConnected: Boolean(account),
          isContract,
          networkType,
        }
      } catch (err) {
        return NO_WALLET
      }
    },

    onResult: wallet => {
      if (hasChanged(wallet)) {
        lastWallet = wallet
        onUpdate(wallet)
      }
    },
  }
}, WALLET_POLL_DELAY)

// useWallet() provides everything related to the account
// currently connected, which we refer to as the “wallet”.
const WalletContext = React.createContext()

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider(props) {
  const [wallet, setWallet] = useState(NO_WALLET)

  useEffect(() => pollWallet(setWallet), [])

  return <WalletContext.Provider value={wallet} {...props} />
}

// useWalletBlockNumber() is independent from
// useWallet() because it updates more often.
const WalletBlockNumberContext = React.createContext()

export function WalletBlockNumberProvider(props) {
  const [blockNumber, setBlockNumber] = useState(-1)

  useEffect(() => {
    const pollBlockNumber = pollEvery(() => {
      return {
        request: () => WALLET_WEB3.eth.getBlockNumber(),
        onResult: latestBlockNumber => setBlockNumber(latestBlockNumber),
      }
    }, WALLET_BLOCK_POLL_DELAY)

    const cleanBlockPoll = pollBlockNumber()

    return () => cleanBlockPoll()
  }, [])

  return <WalletBlockNumberContext.Provider value={blockNumber} {...props} />
}

export function useWalletBlockNumber() {
  return useContext(WalletBlockNumberContext)
}
