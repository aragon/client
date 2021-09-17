import { getDaiTokenAddress } from '../../../../util/network'

export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

const getDaiToken = networkType => ({
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address: getDaiTokenAddress(networkType),
})

const ETHER_TOKEN = {
  symbol: 'ETH',
  name: 'Ether',
  address: ETHER_TOKEN_FAKE_ADDRESS,
}

export function getDefaultRedeemableTokens(networkType) {
  return [ETHER_TOKEN, getDaiToken(networkType)]
}

export function getDefaultAcceptedTokens(networkType) {
  return [ETHER_TOKEN, getDaiToken(networkType)]
}

export function getDefaultLockTokenByNetwork(networkType) {
  return getDaiToken(networkType)
}
