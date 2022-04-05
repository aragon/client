import { getPortisDappId, getFortmaticApiKey } from '../local-settings'

const FORMATIC_KEY = getFortmaticApiKey()
const PORTIS_ID = getPortisDappId()

export const connectors = [
  {
    id: 'injected',
    properties: {
      chainId: [1, 4, 137, 80001, 1666600000, 1666700000, 97, 56, 588, 1088], // add here to handle more injected chains
    },
  },
  {
    id: 'frame',
    properties: {
      chainId: 1,
    },
  },
  FORMATIC_KEY
    ? {
        id: 'fortmatic',
        properties: {
          chainId: 1,
          apiKey: FORMATIC_KEY,
        },
      }
    : null,
  PORTIS_ID
    ? {
        id: 'portis',
        properties: {
          dAppId: PORTIS_ID,
          chainId: [1],
        },
      }
    : null,
  {
    id: 'walletconnect',
    properties: {
      chainId: [1, 4, 137, 80001, 1666600000, 1666700000, 97, 56, 588, 1088], // add here to handle more injected chains
      rpc: {
        '1': 'https://mainnet.eth.aragon.network',
        '4': 'https://rinkeby.eth.aragon.network',
        '137': 'https://polygon-rpc.com',
        '80001': 'https://rpc-mumbai.maticvigil.com',
        '1666600000': 'https://api.harmony.one/',
        '1666700000': 'https://api.s0.b.hmny.io/',
        '97': 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        // '56': 'https://bsc-dataseed.binance.org/', //connecting to bnb is not working
        '588': 'https://stardust.metis.io/?owner=588',
        '1088': 'https://andromeda.metis.io/?owner=1088',
      },
    },
  },
].filter(p => p)

// the final data that we pass to use-wallet package.
export const useWalletConnectors = connectors.reduce((current, connector) => {
  current[connector.id] = connector.properties || {}
  return current
}, {})
