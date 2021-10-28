import { chains } from 'use-wallet'
import { getDaiTokenAddress, getChainId } from '../../../../util/network'

export const TOKEN_FAKE_ADDRESS = '0x0000000000000000000000000000000000000000'

const getDaiToken = networkType => ({
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address: getDaiTokenAddress(networkType),
})

const getNativeCurrency = networkType => {
  const chainId = getChainId(networkType)
  const symbol = chains.getChainInformation(chainId)?.nativeCurrency.symbol
  return {
    symbol,
    address: TOKEN_FAKE_ADDRESS,
  }
}

export function getDefaultRedeemableTokens(networkType) {
  return [getNativeCurrency(networkType), getDaiToken(networkType)]
}

export function getDefaultAcceptedTokens(networkType) {
  return [getNativeCurrency(networkType), getDaiToken(networkType)]
}

export function getDefaultLockTokenByNetwork(networkType) {
  return getDaiToken(networkType)
}
