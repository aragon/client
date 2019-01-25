import { getEnsRegistryAddress } from './local-settings'

const localEnsRegistryAddress = getEnsRegistryAddress()

export const networkConfigs = {
  main: {
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x314159265dd8dbb310642f98f50c066173c1259b',
    },
    nodes: {
      defaultEth: 'wss://mainnet.eth.aragon.network/ws',
    },
    settings: {
      chainId: 1,
      name: 'Mainnet',
      type: 'main', // as returned by web3.eth.net.getNetworkType()
    },
  },
  rinkeby: {
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x98df287b6c145399aaa709692c8d308357bc085d',
    },
    nodes: {
      defaultEth: 'wss://rinkeby.eth.aragon.network/ws',
    },
    settings: {
      chainId: 4,
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
  if (networkType === 'private') {
    return 'localhost'
  } else if (networkType === 'main') {
    return 'mainnet'
  }
  return networkType
}
