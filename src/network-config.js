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
      shortName: 'Mainnet',
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
      shortName: 'Rinkeby',
      type: 'rinkeby', // as returned by web3.eth.net.getNetworkType()
    },
  },
  ropsten: {
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x6afe2cacee211ea9179992f89dc61ff25c61e923',
    },
    nodes: {
      defaultEth: 'wss://ropsten.eth.aragon.network/ws',
    },
    settings: {
      chainId: 3,
      name: 'Ropsten testnet',
      shortName: 'Ropsten',
      type: 'ropsten', // as returned by web3.eth.net.getNetworkType()
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
      shortName: 'Local',
      type: 'private',
    },
  },
  unknown: {
    addresses: {
      ensRegistry: localEnsRegistryAddress,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    settings: {
      name: `Unknown network`,
      shortName: 'Unknown',
      type: 'unknown',
    },
  },
}

export function getNetworkConfig(type) {
  return (
    networkConfigs[type] || {
      ...networkConfigs.unknown,
      settings: {
        ...networkConfigs.unknown.settings,
        name: `Unsupported network (${type})`,
      },
    }
  )
}

export function getNetworkByChainId(chainId = -1) {
  chainId = Number(chainId)
  return (
    Object.values(networkConfigs).find(
      network => network.settings.chainId === chainId
    ) || networkConfigs.unknown
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
