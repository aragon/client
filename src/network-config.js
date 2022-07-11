import { getEnsRegistryAddress } from './local-settings'
import { useWallet } from './contexts/wallet'
import { chains } from 'use-wallet'

const localEnsRegistryAddress = getEnsRegistryAddress()
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const DAI_RINKEBY_TOKEN_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'

// TODO stop exposing data object [vr 17-09-2021]
// cconnectGraphEndpoint is https://github.com/aragon/connect/tree/master/packages/connect-thegraph
export const networkConfigs = {
  [chains.getChainInformation(1).type]: {
    isActive: true,
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
      ...chains.getChainInformation(1),
      live: true,
    },
  },
  [chains.getChainInformation(3).type]: {
    isActive: false,
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
      ...chains.getChainInformation(3),
    },
  },
  [chains.getChainInformation(4).type]: {
    isActive: true,
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
      ...chains.getChainInformation(4), // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
  },
  [chains.getChainInformation(1337).type]: {
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
      ...chains.getChainInformation(1337),
      live: false,
    },
  },
  // xDai is an experimental chain in the Aragon Client. It's possible
  // and expected that a few things will break.
  [chains.getChainInformation(100).type]: {
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
      ...chains.getChainInformation(100),
    },
  },
  [chains.getChainInformation(137).type]: {
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x3c70a0190d09f34519e6e218364451add21b7d4b',
      governExecutorProxy: null,
      dai: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    nodes: {
      defaultEth: 'wss://mainnet-polygon.aragon.network/ws',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 137,
      testnet: false,
      ...chains.getChainInformation(137),
      live: true,
      options: {
        timeout: 30000, // ms

        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },

        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    },
  },
  [chains.getChainInformation(80001).type]: {
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x431f0eed904590b176f9ff8c36a1c4ff0ee9b982',
      governExecutorProxy: null,
      dai: '0x94f417C155bB3fF7365828Bb7aCD26E84C17e830',
    },
    nodes: {
      defaultEth:
        'wss://polygon-mumbai.g.alchemy.com/v2/wgOXirpZVAKhsdwji9jzIE2rax8BsmHT',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 80001,
      testnet: true,
      ...chains.getChainInformation(80001),
      live: true,
    },
  },
  [chains.getChainInformation(56).type]: {
    isActive: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x431f0eed904590b176f9ff8c36a1c4ff0ee9b982',
      governExecutorProxy: null,
      dai: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    },
    nodes: {
      // defaultEth: 'TO BE CREATED',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 56,
      testnet: false,
      ...chains.getChainInformation(56),
      live: true,
    },
  },
  [chains.getChainInformation(97).type]: {
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x843ddfab8406e752d03fa75dbb275070f368658d',
      governExecutorProxy: null,
      dai: '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867',
    },
    nodes: {
      defaultEth:
        'wss://speedy-nodes-nyc.moralis.io/e2537fd4d6ad21265cf9d450/bsc/testnet/ws',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 97,
      testnet: true,
      ...chains.getChainInformation(97),
      live: true,
    },
  },

  [chains.getChainInformation(1666600000).type]: {
    isActive: true,
    enableMigrateBanner: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x843ddfab8406e752d03fa75dbb275070f368658d',
      governExecutorProxy: null,
      dai: '0xef977d2f931c1978db5f6747666fa1eacb0d0339',
    },
    nodes: {
      defaultEth: 'wss://ws.s0.t.hmny.io/',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 1666600000,
      ...chains.getChainInformation(1666600000),
      live: false,
      events: {
        blockSizeLimit: 1024,
      },
      options: {
        timeout: 30000, // ms

        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },

        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    },
  },

  [chains.getChainInformation(588).type]: {
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x843ddfab8406e752d03fa75dbb275070f368658d',
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'wss://stardust-ws.metis.io/',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 588,
      testnet: true,
      customSyncDelays: {
        MILD_PROVIDER_SYNC_DELAY: 25,
        OK_PROVIDER_SYNC_DELAY: 15,
      },
      ...chains.getChainInformation(588),
      live: true,
    },
  },
  [chains.getChainInformation(1088).type]: {
    isActive: true,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0x843ddfab8406e752d03fa75dbb275070f368658d',
      governExecutorProxy: null,
    },
    nodes: {
      defaultEth: 'wss://andromeda-ws.metis.io/',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 1088,
      testnet: false,
      customSyncDelays: {
        MILD_PROVIDER_SYNC_DELAY: 25,
        OK_PROVIDER_SYNC_DELAY: 15,
      },
      ...chains.getChainInformation(1088),
      live: true,
    },
  },

  [chains.getChainInformation(1666700000).type]: {
    isActive: true,
    enableMigrateBanner: false,
    addresses: {
      ensRegistry:
        localEnsRegistryAddress || '0xbc7828fa8665c637901ad5abd5c7e647c9ab140f',
      governExecutorProxy: null,
      dai: '0x97F2f01096c1B6942220158c130662f35C3a3166',
    },
    nodes: {
      defaultEth: 'wss://ws.s0.pops.one/',
    },
    connectGraphEndpoint: null,
    settings: {
      chainId: 1666700000,
      ...chains.getChainInformation(1666700000),
      live: true,
      events: {
        blockSizeLimit: 1024,
      },
      options: {
        timeout: 30000, // ms

        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },

        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    },
  },

  unknown: {
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
