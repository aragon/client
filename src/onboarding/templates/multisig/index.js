import { isAddress } from 'web3-utils'
import ConfigureMultisigToken from './ConfigureMultisigToken'
import ConfigureMultisigAddresses from './ConfigureMultisigAddresses'
import icon from './assets/icon.svg'

const template = {
  name: 'multisig',
  label: 'Token project with Multisig',
  icon,
  fields: {
    signers: {
      defaultValue: () => [''],
      filter: value => {
        if (!Array.isArray(value) || value.length < 1) {
          return { signers: [''] }
        }
        return { signers: value }
      },
    },
    neededSignatures: {
      defaultValue: () => 1,
      filter: (value, { signers }) => {
        const intValue = parseInt(value, 10)
        return {
          neededSignatures: isNaN(intValue)
            ? 1
            : Math.min(signers.length, Math.max(1, value)),
        }
      },
    },
    tokenName: {
      defaultValue: () => '',
      filter: value => ({ tokenName: value.slice(0, 30) }),
    },
    tokenSymbol: {
      defaultValue: () => '',
      filter: value => ({ tokenSymbol: value.toUpperCase().slice(0, 5) }),
    },
  },
  screens: [
    {
      screen: 'multisig-addresses',
      validate: ({ signers }) => {
        return signers.every(signer => isAddress(signer.trim()))
      },
      Component: ConfigureMultisigAddresses,
    },
    {
      screen: 'multisig-token-name',
      validate: ({ tokenName, tokenSymbol }) => {
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
