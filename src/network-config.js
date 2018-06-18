import { getEnsRegistryAddress } from './local-settings'
import { makeEtherscanBaseUrl } from './utils'

const localEnsRegistryAddress = getEnsRegistryAddress()

export const networkConfigs = {
  mainnet: {
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x314159265dd8dbb310642f98f50c066173c1259b',
    },
    nodes: {
      defaultEth: 'wss://mainnet.aragon.network/ws',
    },
    settings: {
      chainId: 1,
      etherscanBaseUrl: makeEtherscanBaseUrl('mainnet'),
      name: 'Mainnet',
      type: 'main', // as returned by web3.eth.net.getNetworkType()
    },
  },
  rinkeby: {
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0xfbae32d1cde62858bc45f51efc8cc4fa1415447e',
    },
    nodes: {
      defaultEth: 'ws://rinkeby.aragon.network:8546',
    },
    settings: {
      chainId: 4,
      etherscanBaseUrl: makeEtherscanBaseUrl('rinkeby'),
      name: 'Rinkeby testnet',
      type: 'rinkeby', // as returned by web3.eth.net.getNetworkType()
    },
  },
  local: {
    addresses: {
      ensRegistry: localEnsRegistryAddress,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    settings: {
      name: 'local testnet',
      type: 'private',
    },
  },
}

export function getNetworkConfig(type) {
  return (
    networkConfigs[type] || {
      ...networkConfigs.local,
      settings: {
        name: `Unsupported network (${type})`,
        type: 'unknown',
      },
    }
  )
}

export function sanitizeNetworkType(networkType) {
  return networkType === 'private' ? 'localhost' : networkType
}
