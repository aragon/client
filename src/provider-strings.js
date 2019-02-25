// Get a string that that depend on the current Ethereum provider. The default
// string is used as an identifier (à la gettext).
//
// See identifyProvider() in web3-utils.js for a list of provider IDs that can
// be detected.

const PROVIDERS_STRINGS = {
  frame: {
    'your Ethereum provider': 'Frame',
  },
  metamask: {
    'your Ethereum provider': 'Metamask',
  },
}

export default function getProviderString(string, providerId = 'unknown') {
  return (
    (PROVIDERS_STRINGS[providerId] && PROVIDERS_STRINGS[providerId][string]) ||
    string
  )
}
