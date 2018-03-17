import { isAddress } from 'web3-utils'
import ConfigureMultisigToken from './ConfigureMultisigToken'
import ConfigureMultisigAddresses from './ConfigureMultisigAddresses'
import icon from './assets/icon.svg'

const template = {
  name: 'multisig',
  label: 'Token project with Multisig',
  icon,
  screens: [
    {
      screen: 'multisig-addresses',
      fields: {
        signers: {
          defaultValue: () => [''],
          filter: value => {
            if (!Array.isArray(value)) {
              return ['']
            }
            if (value.length < 1) return ['']
            return value
          },
        },
        neededSignatures: {
          defaultValue: () => 1,
          filter: (value, { signers }) => {
            const intValue = parseInt(value, 10)
            return isNaN(intValue)
              ? 1
              : Math.min(signers.length, Math.max(1, value))
          },
        },
      },
      validateScreen: ({ signers, neededSignatures }) => {
        if (!signers.every(signer => isAddress(signer.trim()))) {
          return false
        }
        return true
      },
      Component: ConfigureMultisigAddresses,
    },
    {
      screen: 'multisig-token-name',
      fields: {
        tokenName: {
          defaultValue: () => '',
          filter: value => value,
          isValid: value => value.length > 0,
        },
        tokenSymbol: {
          defaultValue: () => '',
          filter: value => value.toUpperCase(),
          isValid: value => value.length > 0,
        },
      },
      validateScreen: ({ tokenName, tokenSymbol }) => {
        return tokenName.length > 0 && tokenSymbol.length > 0
      },
      Component: ConfigureMultisigToken,
    },
  ],
  prepareData: ({ tokenName, tokenSymbol, signers, neededSignatures }) => {
    return {
      tokenName: tokenName.trim(),
      tokenSymbol: tokenSymbol.trim(),
      signers: signers.map(signer => signer.trim()),
      neededSignatures: Math.min(signers.length, Math.max(1, neededSignatures)),
    }
  },
}

export default template
