import { isElectron } from '../utils'

import frame from './icons/Frame.png'
import cipher from './icons/Cipher.png'
import metamask from './icons/Metamask.png'
import status from './icons/Status.png'

// See the corresponding prop type, EthereumProviderType, in prop-types.js.
const PROVIDERS = new Map(
  [
    {
      id: 'frame',
      name: 'Frame',
      type: 'Desktop',
      image: frame,
      connect: async () => true,
      strings: {
        'your Ethereum provider': 'Frame',
      },
    },
    {
      id: 'metamask',
      name: 'Metamask',
      type: 'Desktop',
      image: metamask,
      connect: async () => true,
      strings: {
        'your Ethereum provider': 'Metamask',
      },
    },
    {
      id: 'status',
      name: 'Status',
      type: 'Mobile',
      image: status,
      connect: async () => true,
      strings: {
        'your Ethereum provider': 'Status',
      },
    },
    {
      id: 'cipher',
      name: 'Cipher',
      type: 'Mobile',
      image: cipher,
      connect: async () => true,
      strings: {
        'your Ethereum provider': 'Cipher',
      },
    },
  ].map(provider => [provider.id, provider])
)

// Get a providers object for a given ID.
function getProvider(providerId) {
  return PROVIDERS.get(providerId)
}

// Get a string that depends on the current Ethereum provider.
// The default string is used as an identifier (à la gettext).
function getProviderString(string, providerId = 'unknown') {
  const provider = getProvider(providerId)
  return (provider && provider.strings[string]) || string
}

// Get an identifier for the provider, if it can be detected.
function identifyProvider(provider) {
  if (provider && isElectron()) {
    return 'frame'
  }
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

export { getProvider, identifyProvider, getProviderString }
export default PROVIDERS
