import frame from './icons/Frame.png'
import cipher from './icons/Cipher.png'
import metamask from './icons/Metamask.png'
import status from './icons/Status.png'

// see the corresponding prop type in prop-types.js
const PROVIDERS = new Map(
  [
    {
      id: 'frame',
      name: 'Frame',
      type: 'Desktop',
      image: frame,
      connect: () => {},
      strings: {
        'your Ethereum provider': 'Frame',
      },
    },
    {
      id: 'metamask',
      name: 'Metamask',
      type: 'Desktop',
      image: metamask,
      connect: () => {},
      strings: {
        'your Ethereum provider': 'Metamask',
      },
    },
    {
      id: 'status',
      name: 'Status',
      type: 'Mobile',
      image: status,
      connect: () => {},
      strings: {
        'your Ethereum provider': 'Status',
      },
    },
    {
      id: 'cipher',
      name: 'Cipher',
      type: 'Mobile',
      image: cipher,
      connect: () => {},
      strings: {
        'your Ethereum provider': 'Cipher',
      },
    },
  ].map(provider => [provider.id, provider])
)

// Get a string that that depend on the current Ethereum provider. The default
// string is used as an identifier (à la gettext). Also see identifyProvider()
// in web3-utils.js for a list of provider IDs that can be detected.
function getProviderString(string, providerId = 'unknown') {
  const provider = PROVIDERS.get(providerId)
  return (provider && provider.strings[string]) || string
}

export { getProviderString }
export default PROVIDERS
