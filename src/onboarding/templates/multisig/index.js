import { isAddress } from '../../../web3-utils'
import ConfigureMultisigToken from './ConfigureMultisigToken'
import ConfigureMultisigAddresses from './ConfigureMultisigAddresses'
import icon from './assets/icon.svg'

const defaultSignersValue = {
  addresses: [''],
  errors: [],
}

const template = {
  name: 'multisig',
  label: 'Token project with Multisig',
  icon,
  fields: {
    signers: {
      defaultValue: () => defaultSignersValue,
      filter: ({ addresses } = {}) => {
        if (!Array.isArray(addresses) || addresses.length < 1) {
          return defaultSignersValue
        }

        // Look for duplicates
        const duplicatesSet = new Set()
        const errors = addresses.reduce((errors, address, index) => {
          if (duplicatesSet.has(address)) {
            errors.push({
              index,
              message:
                'Each multisig signer needs to have a different address.',
            })
          } else if (address) {
            duplicatesSet.add(address)
          }
          return errors
        }, [])

        return {
          signers: {
            addresses,
            errors,
          },
        }
      },
    },
    neededSignatures: {
      defaultValue: () => 1,
      filter: (value, { signers: { addresses = [] } = {} }) => {
        const intValue = parseInt(value, 10)
        return {
          neededSignatures: isNaN(intValue)
            ? 1
            : Math.min(addresses.length, Math.max(1, value)),
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
      validate: ({ signers: { addresses } }) => {
        const addressesSet = new Set(addresses)
        return (
          addressesSet.size === addresses.length &&
          addresses.every(signer => isAddress(signer.trim()))
        )
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
      signers: signers.addresses.map(signer => signer.trim()),
      neededSignatures: Math.min(
        signers.addresses.length,
        Math.max(1, neededSignatures)
      ),
    }
  },
}

export default template
