import { getEnsRegistryAddress } from './local-settings'
import { useWallet, KNOWN_CHAINS } from './contexts/wallet'

const localEnsRegistryAddress = getEnsRegistryAddress()
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527e400502d0cb4f214dd0d2f2a323fc88ff924'

// TODO stop exposing data object [vr 17-09-2021]
// cconnectGraphEndpoint is https://github.com/aragon/connect/tree/master/packages/connect-thegraph
export const networkConfigs = {
  [KNOWN_CHAINS.get(1).type]: {
    isActive: true,
    enableMigrateBanner: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      dai: DAI_MAINNET_TOKEN_ADDRESS,
      governExecutorProxy: '0x2ac40310167fb00afa3c0bb5953c707db155afac',
    },
    nodes: {
      defaultEth: 'wss://mainnet.eth.aragon.network/ws',
    },
    connectGraphEndpoint:
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet',
    settings: {
      chainId: 1,
      testnet: false,
      ...KNOWN_CHAINS.get(1),
      shortName: 'Ethereum',
      live: true,
    },
  },
  [KNOWN_CHAINS.get(4).type]: {
    isActive: true,
    enableMigrateBanner: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x98df287b6c145399aaa709692c8d308357bc085d',
      dai: DAI_RINKEBY_TOKEN_ADDRESS,
      governExecutorProxy: '0x0451533f685fe028c439821b7502e4cf63b4c32f',
    },
    nodes: {
      defaultEth: 'wss://rinkeby.eth.aragon.network/ws',
    },
    connectGraphEndpoint:
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby',
    settings: {
      chainId: 4,
      testnet: true,
      ...KNOWN_CHAINS.get(4), // as returned by web3.eth.net.getNetworkType()
      fullName: 'Rinkeby Testnet',
      live: true,
    },
  },
  [KNOWN_CHAINS.get(3).type]: {
    isActive: false,
    enableMigrateBanner: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x6afe2cacee211ea9179992f89dc61ff25c61e923',
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'wss://ropsten.eth.aragon.network/ws',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 3,
      testnet: true,
      ...KNOWN_CHAINS.get(3),
      live: true,
    },
  },
  [KNOWN_CHAINS.get(1337).type]: {
    enableMigrateBanner: true,
    isActive: false,
    addresses: {
      ensRegistry: localEnsRegistryAddress,
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    connectGraphEndpoint: null,
    settings: {
      // Local development environments by convention use
      // a chainId of value 1337, but for the sake of configuration
      // we expose a way to change this value.
      chainId: 1337,
      testnet: true,

      ...KNOWN_CHAINS.get(1337),
      live: false,
    },
  },
  // xDai is an experimental chain in the Aragon Client. It's possible
  // and expected that a few things will break.
  [KNOWN_CHAINS.get(100).type]: {
    enableMigrateBanner: false,
    isActive: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0xaafca6b0c89521752e559650206d7c925fd0e530',
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'wss://xdai.poanetwork.dev/wss',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 100,
      testnet: false,
      ...KNOWN_CHAINS.get(100),
      live: true,
    },
  },
  [KNOWN_CHAINS.get(137).type]: {
    enableMigrateBanner: false,
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x3c70a0190d09f34519e6e218364451add21b7d4b',
      governExecutorProxy: null,
      dai: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    nodes: {
      defaultEth:
        'wss://cool-frosty-frog.matic.quiknode.pro/bd32caa885f4bbf687a022490b1b5cce6ddab38a/',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 137,
      testnet: false,
      ...KNOWN_CHAINS.get(137),
      shortName: 'Polygon',
      live: true,
    },
  },
  [KNOWN_CHAINS.get(80001).type]: {
    enableMigrateBanner: false,
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x431f0eed904590b176f9ff8c36a1c4ff0ee9b982',
      governExecutorProxy: null,
      dai: '0x94f417C155bB3fF7365828Bb7aCD26E84C17e830',
    },
    nodes: {
      defaultEth: 'wss://matic-testnet-archive-ws.bwarelabs.com',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 80001,
      testnet: true,
      ...KNOWN_CHAINS.get(80001),
      fullName: 'Mumbai Testnet',
      live: true,
    },
  },
  unknown: {
    enableMigrateBanner: false,
    isActive: false,
    addresses: {
      ensRegistry: localEnsRegistryAddress,
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'ws://localhost:8545',
    },
    connectGraphEndpoint: null,
    settings: {
      testnet: true,
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

export function useNetworkConfig() {
  const { networkType } = useWallet()
  return getNetworkConfig(networkType)
}
