import PropTypes from 'prop-types'
import Aragon from '@aragon/wrapper'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from './symbols'
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

export const EthereumAddressType = validatorCreator(ethereumAddressValidator)

export const AppType = PropTypes.shape({
  abi: PropTypes.array.isRequired,
  appId: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  codeAddress: EthereumAddressType.isRequired,
  functions: PropTypes.array.isRequired,
  hasWebApp: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  proxyAddress: EthereumAddressType.isRequired,
  src: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,

  appName: PropTypes.string,
  apmRegistry: PropTypes.string,
  content: PropTypes.shape({
    location: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
  }),
  description: PropTypes.string,
  icons: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    })
  ),
  isForwarder: PropTypes.bool,
  kernelAddress: EthereumAddressType,
  isAragonOsInternalApp: PropTypes.bool,
  roles: PropTypes.array,
  status: PropTypes.string,
  version: PropTypes.string,
})

export const AppInstanceType = PropTypes.shape({
  codeAddress: EthereumAddressType,
  identifier: PropTypes.string,
  instanceId: PropTypes.oneOfType([EthereumAddressType, PropTypes.string])
    .isRequired,
  proxyAddress: EthereumAddressType,
})

export const AppInstanceGroupType = PropTypes.shape({
  app: PropTypes.object.isRequired,
  appId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  instances: PropTypes.arrayOf(AppInstanceType).isRequired,
  hasWebApp: PropTypes.bool.isRequired,
  repoName: PropTypes.string,
})

export const AppsStatusType = PropTypes.oneOf([
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
])

export const AragonType = PropTypes.instanceOf(Aragon)

export const FavoriteDaoType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddressType,
  favorited: PropTypes.bool,
})

export const DaoItemType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddressType,
})

export const DaoAddressType = PropTypes.shape({
  address: EthereumAddressType,
  domain: PropTypes.string,
})

export const RenderFnType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.oneOf([false]),
])

export const RepoContentType = PropTypes.shape({
  name: PropTypes.string,
  changelog_url: PropTypes.string,
  description: PropTypes.string,
  details_url: PropTypes.string,
  icons: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      sizes: PropTypes.string.isRequired,
    })
  ),
  screenshots: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    })
  ),
})

export const RepoType = PropTypes.shape({
  appId: PropTypes.string.isRequired,
  currentVersion: PropTypes.shape({
    content: RepoContentType.isRequired,
    version: PropTypes.string.isRequired,
  }),
  latestVersion: PropTypes.shape({
    content: RepoContentType.isRequired,
    version: PropTypes.string.isRequired,
  }),
  repoAddress: EthereumAddressType.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      contentURI: PropTypes.string.isRequired,
      contractAddress: PropTypes.string.isRequired,
      timestamp: PropTypes.number,
      version: PropTypes.string.isRequired,
      versionId: PropTypes.string.isRequired,
    })
  ),
})
