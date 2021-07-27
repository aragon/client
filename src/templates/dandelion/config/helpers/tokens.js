export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527e400502d0cb4f214dd0d2f2a323fc88ff924'
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

const getDaiToken = networkType => ({
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address:
    networkType === 'main'
      ? DAI_MAINNET_TOKEN_ADDRESS
      : networkType === 'rinkeby'
      ? DAI_RINKEBY_TOKEN_ADDRESS
      : '',
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
