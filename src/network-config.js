import { getLocalChainId, getEnsRegistryAddress } from './local-settings'
import { useWallet, KNOWN_CHAINS, CHAIN_ID_MAINNET } from './wallet'

const localEnsRegistryAddress = getEnsRegistryAddress()
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527e400502d0cb4f214dd0d2f2a323fc88ff924'

// connectGraphEndpoint is https://github.com/aragon/connect/tree/master/packages/connect-thegraph
export const networkConfigs = {
  main: {
    enableMigrateBanner: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      dai: DAI_MAINNET_TOKEN_ADDRESS,
    },
    nodes: {
      defaultEth: 'wss://mainnet.eth.aragon.network/ws',
    },
    connectGraphEndpoint:
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet',
    settings: {
      chainId: 1,
      name: 'Mainnet',
      shortName: 'Mainnet',
      type: 'main',
      live: true,
    },
  },
  rinkeby: {
    enableMigrateBanner: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x98df287b6c145399aaa709692c8d308357bc085d',
      dai: DAI_RINKEBY_TOKEN_ADDRESS,
    },
    nodes: {
      defaultEth: 'wss://rinkeby.eth.aragon.network/ws',
    },
    connectGraphEndpoint:
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby',
    settings: {
      chainId: 4,
      name: 'Rinkeby testnet',
      shortName: 'Rinkeby',
      type: 'rinkeby', // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
  },
  ropsten: {
    enableMigrateBanner: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x6afe2cacee211ea9179992f89dc61ff25c61e923',
    },
    nodes: {
      defaultEth: 'wss://ropsten.eth.aragon.network/ws',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 3,
      name: 'Ropsten testnet',
      shortName: 'Ropsten',
      type: 'ropsten', // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
  },
  local: {
    enableMigrateBanner: true,
    addresses: {
      ensRegistry: localEnsRegistryAddress,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    connectGraphEndpoint: null,
    settings: {
      // Local development environments by convention use
      // a chainId of value 1337, but for the sake of configuration
      // we expose a way to change this value.
      chainId: Number(getLocalChainId()),
      name: 'local testnet',
      shortName: 'Local',
      type: 'private',
      live: false,
    },
  },
  // xDai is an experimental chain in the Aragon Client. It's possible
  // and expected that a few things will break.
  xdai: {
    enableMigrateBanner: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0xaafca6b0c89521752e559650206d7c925fd0e530',
    },
    nodes: {
      defaultEth: 'wss://xdai.poanetwork.dev/wss',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 100,
      name: 'xDai',
      shortName: 'xdai',
      type: 'private',
      live: true,
    },
  },
  unknown: {
    enableMigrateBanner: true,
    addresses: {
      ensRegistry: localEnsRegistryAddress,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    connectGraphEndpoint: null,
    settings: {
      name: `Unknown network`,
      shortName: 'Unknown',
      type: 'unknown',
      live: false,
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

export function normalizeNetworkName(networkType) {
  return getNetworkConfig(networkType).settings.shortName
}

export function sanitizeNetworkType(networkType) {
  if (networkType === 'private') {
    return 'localhost'
  } else if (isOnMainnet(networkType)) {
    return 'mainnet'
  }
  return networkType
}

export function getNetworkName(networkType) {
  return getNetworkConfig(networkType).settings.name
}

export function getNetworkSettings(networkType) {
  return getNetworkConfig(networkType).settings
}

export function useNetworkConfig() {
  const { networkType } = useWallet()
  return getNetworkConfig(networkType)
}

export function isOnMainnet(networkType) {
  return networkType === KNOWN_CHAINS.get(CHAIN_ID_MAINNET)
}

export function getDaiTokenAddress(networkType) {
  return getNetworkConfig(networkType).addresses.dai || ''
}
