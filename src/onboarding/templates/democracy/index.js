import BN from 'bn.js'
import ConfigureVotingDefaults from './ConfigureVotingDefaults'
import ConfigureTokenName from './ConfigureTokenName'
import icon from './assets/icon.svg'

const isIntegerString = value => /^\d*$/.test(value)
const isFloatString = value => /^\d*\.?\d*$/.test(value)

const template = {
  name: 'democracy',
  label: 'Token project with Democracy',
  icon,
  fields: {
    support: {
      defaultValue: () => '',
      filter: (value, { minQuorum }) => {
        if (!isFloatString(value)) {
          return { support: '' }
        }
        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
          return { support: '' }
        }

        const support = Math.min(99.99, Math.max(1, numValue))
        return {
          support: support !== numValue ? support.toString() : value,
          minQuorum: (support < minQuorum ? support : minQuorum).toString(),
        }
      },
    },
    minQuorum: {
      defaultValue: () => '',
      filter: (value, { support }) => {
        if (!isFloatString(value)) {
          return { minQuorum: '' }
        }
        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
          return { minQuorum: '' }
        }

        const minQuorum = Math.min(99.99, Math.max(0, numValue))
        return {
          minQuorum: minQuorum !== numValue ? minQuorum.toString() : value,
          support: (support < minQuorum ? minQuorum : support).toString(),
        }
      },
    },
    voteDuration: {
      defaultValue: () => '',
      filter: value => {
        if (!isIntegerString(value) || value === '') {
          return { voteDuration: '' }
        }
        const voteDuration = parseInt(value, 10)
        if (isNaN(voteDuration)) {
          return ''
        }
        if (voteDuration > Number.MAX_SAFE_INTEGER) {
          return ''
        }
        return {
          voteDuration: Math.max(1, value).toString(),
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
      screen: 'voting-defaults',
      validate: ({ support, minQuorum, voteDuration }) => {
        // Mimic contract validation
        if (minQuorum < 0 || minQuorum > support) {
          return false
        }
        if (support < 1 || support >= 100) {
          return false
        }
        if (voteDuration < 1) {
          return false
        }
        return true
      },
      Component: ConfigureVotingDefaults,
    },
    {
      screen: 'token-name',
      validate: ({ tokenName, tokenSymbol }) => {
        return tokenName.length > 0 && tokenSymbol.length > 0
      },
      Component: ConfigureTokenName,
    },
  ],
  prepareData: ({
    tokenName,
    tokenSymbol,
    support,
    minQuorum,
    voteDuration,
  }) => {
    const percentageBase = new BN(10).pow(new BN(16))
    return {
      tokenName: tokenName.trim(),
      tokenSymbol: tokenSymbol.trim(),
      supportNeeded: percentageBase.muln(parseFloat(support)),
      minAcceptanceQuorum: percentageBase.muln(parseFloat(minQuorum)),
      voteDuration: voteDuration * 60 * 60,
    }
  },
}

export default template
