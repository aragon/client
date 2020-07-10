import {
  getEnsRegistryAddress,
  getEthEndpoint,
  getFortmaticApiKey,
  getLocalChainId,
  getPortisDappId,
} from './local-settings'

const fortmaticApiKey = getFortmaticApiKey()
const portisDappId = getPortisDappId()

const providedEthEndpoint = getEthEndpoint()
const providedEnsRegistryAddress = getEnsRegistryAddress()

const networkConfigurations = {
  // Ethereum mainnet
  ethereum: {
    addresses: {
      ensRegistry:
        providedEnsRegistryAddress ||
        '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    endpoints: {
      read: providedEthEndpoint || 'wss://mainnet.eth.aragon.network/ws',
    },
    environment: {
      chainId: 1,
      name: 'Ethereum',
      shortName: 'Mainnet',
      type: 'main', // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
    providers: [
      { id: 'provided' },
      { id: 'frame' },
      fortmaticApiKey ? { id: 'fortmatic', conf: fortmaticApiKey } : null,
      portisDappId ? { id: 'portis', conf: portisDappId } : null,
    ].filter(p => p),
  },

  // Rinkeby
  rinkeby: {
    addresses: {
      ensRegistry:
        providedEnsRegistryAddress ||
        '0x98df287b6c145399aaa709692c8d308357bc085d',
    },
    endpoints: {
      read: providedEthEndpoint || 'wss://rinkeby.eth.aragon.network/ws',
    },
    environment: {
      chainId: 4,
      name: 'Ethereum Rinkeby test',
      shortName: 'Rinkeby',
      type: 'rinkeby', // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
    // providers: ['injected', 'frame'],
    providers: [
      { id: 'provided' },
      { id: 'frame' },
      fortmaticApiKey ? { id: 'fortmatic', conf: fortmaticApiKey } : null,
      portisDappId ? { id: 'portis', conf: portisDappId } : null,
    ].filter(p => p),
  },

  // Ropsten
  ropsten: {
    addresses: {
      ensRegistry:
        providedEnsRegistryAddress ||
        '0x6afe2cacee211ea9179992f89dc61ff25c61e923',
    },
    endpoints: {
      read: providedEthEndpoint || 'wss://ropsten.eth.aragon.network/ws',
    },
    environment: {
      chainId: 3,
      name: 'Ethereum Ropsten test',
      shortName: 'Ropsten',
      type: 'ropsten', // as returned by web3.eth.net.getNetworkType()
      live: true,
    },
    providers: [{ id: 'provided' }, { id: 'frame' }],
  },

  // xDai
  // xDai is considered experimental and its settings may change in the future.
  xdai: {
    addresses: {
      ensRegistry:
        providedEnsRegistryAddress ||
        '0xaafca6b0c89521752e559650206d7c925fd0e530',
    },
    endpoints: {
      read: providedEthEndpoint || 'wss://xdai.poanetwork.dev/wss',
    },
    environment: {
      chainId: 100,
      name: 'xDai',
      shortName: 'xDai',
      type: 'private',
      live: true,
    },
    providers: [
      { id: 'provided' },
      { id: 'frame' },
      portisDappId ? { id: 'portis', conf: portisDappId } : null,
    ].filter(p => p),
  },

  // Local development testnet
  local: {
    addresses: {
      ensRegistry: providedEnsRegistryAddress,
    },
    endpoints: {
      read: providedEthEndpoint || 'ws://localhost:8545',
    },
    environment: {
      // Local development environments by convention use
      // a chainId of value 1337, but for the sake of configuration
      // we expose a way to change this value.
      chainId: Number(getLocalChainId()),
      name: 'local development',
      shortName: 'local',
      type: 'private',
      live: false,
    },
    providers: [{ id: 'provided' }, { id: 'frame' }],
  },
}

function unknownNetworkConfiguration(id) {
  return {
    addresses: {
      ensRegistry: providedEnsRegistryAddress,
    },
    endpoints: {
      read: providedEthEndpoint || 'ws://localhost:8545',
    },
    environment: {
      name: `unsupported (${id})`,
      shortName: `unsupported (${id})`,
      type: 'unknown',
      live: false,
    },
    providers: [{ id: 'provided' }, { id: 'frame' }],
  }
}

export function getNetworkConfig(id) {
  return networkConfigurations[id] || unknownNetworkConfiguration(id)
}
