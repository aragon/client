import CHAIN_IDS from '../../../../chain-ids'
import { network } from '../../../../environment'

export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527e400502d0cb4f214dd0d2f2a323fc88ff924'
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

const DAI_TOKEN = {
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address:
    network.chainId === CHAIN_IDS.ETHEREUM
      ? DAI_MAINNET_TOKEN_ADDRESS
      : network.chainId === CHAIN_IDS.RINKEBY
      ? DAI_RINKEBY_TOKEN_ADDRESS
      : '',
}
const ETHER_TOKEN = {
  symbol: 'ETH',
  name: 'Ether',
  address: ETHER_TOKEN_FAKE_ADDRESS,
}

export function getDefaultRedeemableTokens() {
  return [ETHER_TOKEN, DAI_TOKEN]
}

export function getDefaultAcceptedTokens() {
  return [ETHER_TOKEN, DAI_TOKEN]
}

export function getDefaultLockTokenByNetwork() {
  return DAI_TOKEN
}
