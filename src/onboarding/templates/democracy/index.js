import ConfigureVotingDefaults from './ConfigureVotingDefaults'
import ConfigureTokenName from './ConfigureTokenName'
import icon from './assets/icon.svg'

const isIntegerString = value => /^[0-9]*$/.test(value)

const template = {
  name: 'democracy',
  label: 'Token project with Democracy',
  icon,
  screens: [
    {
      screen: 'voting-defaults',
      fields: {
        support: {
          defaultValue: () => -1,
          filter: value => {
            if (!isIntegerString(value)) {
              return -1
            }
            const intValue = parseInt(value, 10)
            return isNaN(intValue) ? -1 : Math.min(100, Math.max(1, value))
          },
        },
        minQuorum: {
          defaultValue: () => -1,
          filter: value => {
            if (!isIntegerString(value)) {
              return -1
            }
            const intValue = parseInt(value, 10)
            return isNaN(intValue) ? -1 : Math.min(100, Math.max(0, value))
          },
        },
        voteDuration: {
          defaultValue: () => -1,
          filter: value => {
            if (!isIntegerString(value)) {
              return -1
            }
            const intValue = parseInt(value, 10)
            return isNaN(intValue) ? -1 : Math.max(1, value)
          },
        },
      },
      validateScreen: ({ support, minQuorum, voteDuration }) => {
        if (support < 1 || support > 100) {
          return false
        }
        if (minQuorum < 0 || minQuorum > 100) {
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
      Component: ConfigureTokenName,
    },
  ],
  prepareData: ({
    support,
    minQuorum,
    voteDuration,
    tokenName,
    tokenSymbol,
  }) => {
    return {
      minAcceptanceQuorum: minQuorum / 100,
      supportNeeded: support / 100,
      voteDuration: voteDuration * 60 * 60,
      tokenName: tokenName.trim(),
      tokenSymbol: tokenSymbol.trim(),
    }
  },
}

export default template
