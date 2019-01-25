import PropTypes from 'prop-types'
import { isAddress } from './web3-utils'

const validatorCreator = nonRequiredFunction => {
  const validator = nonRequiredFunction

  validator.isRequired = (props, propName, componentName) => {
    const value = props[propName]

    if (value === null || value === undefined || value === '') {
      return new Error(
        `Property ${propName} is required on ${componentName}, but ${value} was given.`
      )
    }

    return nonRequiredFunction(props, propName, componentName)
  }

  return validator
}

const ethereumAddressValidator = (props, propName, componentName) => {
  const value = props[propName]

  if (value === null || value === undefined || value === '') {
    return null
  }

  if (!isAddress(value)) {
    const valueType = typeof value
    let nonAddress = null

    if (valueType !== 'object') {
      nonAddress = value.toString()
    }

    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. The provided value is not a valid ethereum address.${nonAddress &&
        ` You provided "${nonAddress}"`}`
    )
  }
}

export const EthereumAddress = validatorCreator(ethereumAddressValidator)

export const FavoriteDaoType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddress,
  favorited: PropTypes.bool,
})

export const DaoItemType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddress,
})

export const DaoAddressType = PropTypes.shape({
  address: EthereumAddress,
  domain: PropTypes.string,
})
