import { getPortisDappId, getFortmaticApiKey } from '../local-settings'

const FORMATIC_KEY = getFortmaticApiKey()
const PORTIS_ID = getPortisDappId()

export const connectors = [
  {
    id: 'injected',
    properties: {
      chainId: [
        1,
        5,
        10,
        11155420,
        137,
        80001,
        1666600000,
        1666700000,
        97,
        56,
        588,
        1088,
      ], // add here to handle more injected chains
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
].filter(p => p)

// the final data that we pass to use-wallet package.
export const useWalletConnectors = connectors.reduce((current, connector) => {
  current[connector.id] = connector.properties || {}
  return current
}, {})
