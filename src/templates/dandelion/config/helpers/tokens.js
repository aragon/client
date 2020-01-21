import { network } from '../../../../environment'

export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527E400502d0CB4f214dd0D2F2a323fc88Ff924'

const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

const DAI_TOKEN = { symbol: 'DAI', name: 'Dai Stablecoin', address: '' }
const ETHER_TOKEN = {
  symbol: 'ETH',
  name: 'Ether',
  address: ETHER_TOKEN_FAKE_ADDRESS,
}

function getDAIByNetwork() {
  const daiToken = { ...DAI_TOKEN }
  if (network.type === 'rinkeby') {
    daiToken.address = DAI_RINKEBY_TOKEN_ADDRESS
  } else if (network.type === 'main') {
    daiToken.address = DAI_MAINNET_TOKEN_ADDRESS
  }
  return daiToken
}

export function getDefaultRedeemableTokens() {
  return [ETHER_TOKEN, getDAIByNetwork()]
}

export function getDefaultAcceptedTokens() {
  return [ETHER_TOKEN, getDAIByNetwork()]
}

export function getDefaultLockTokenByNetwork() {
  return getDAIByNetwork()
}
