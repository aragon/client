import PropTypes from 'prop-types'
import Aragon from '@aragon/wrapper'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
  APPS_STATUS_UNLOADED,
  DAO_STATUS_ERROR,
  DAO_STATUS_READY,
  DAO_STATUS_LOADING,
  DAO_STATUS_UNLOADED,
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_TIMED_OUT,
  TRANSACTION_STATUS_ERROR,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SUCCESS,
  TRANSACTION_STATUS_UPCOMING,
} from './symbols'
import { isAddress } from './util/web3'

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

export const ActivityStatusType = PropTypes.oneOf([
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_TIMED_OUT,
])

export const AppType = PropTypes.shape({
  appId: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  codeAddress: EthereumAddressType.isRequired,
  hasWebApp: PropTypes.bool.isRequired,
  proxyAddress: EthereumAddressType.isRequired,
  src: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,

  // This content may not be available if the app's content couldn't be fetched
  abi: PropTypes.array,
  appName: PropTypes.string,
  apmRegistry: PropTypes.string,
  content: PropTypes.shape({
    location: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
  }),
  description: PropTypes.string,
  functions: PropTypes.array,
  icons: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    })
  ),
  name: PropTypes.string,
  roles: PropTypes.array,
  status: PropTypes.string,
  version: PropTypes.string,

  // This content is only available if the app is an aragonOS internal app
  isAragonOsInternalApp: PropTypes.bool,

  // This content is not available if the app is the Kernel
  isForwarder: PropTypes.bool,
  kernelAddress: EthereumAddressType,
})

export const AppsListType = PropTypes.arrayOf(AppType)

export const AppInstanceType = PropTypes.shape({
  // Note that app instances also include embedded applications, like Home, that do not have
  // associated on-chain information
  codeAddress: EthereumAddressType,
  identifier: PropTypes.string,
  instanceId: PropTypes.oneOfType([EthereumAddressType, PropTypes.string])
    .isRequired,
  proxyAddress: EthereumAddressType,
})

export const AppInstanceGroupType = PropTypes.shape({
  app: PropTypes.object.isRequired,
  appId: PropTypes.string.isRequired,
  instances: PropTypes.arrayOf(AppInstanceType).isRequired,

  // This content may not be available if the app's content couldn't be fetched
  hasWebApp: PropTypes.bool,
  name: PropTypes.string,
  repoName: PropTypes.string,
})

export const AppsStatusType = PropTypes.oneOf([
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
  APPS_STATUS_UNLOADED,
])

export const AragonType = PropTypes.instanceOf(Aragon)

export const DaoAddressType = PropTypes.shape({
  address: EthereumAddressType,
  domain: PropTypes.string,
})

export const DaoItemType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddressType,
})

export const DaoStatusType = PropTypes.oneOf([
  DAO_STATUS_ERROR,
  DAO_STATUS_READY,
  DAO_STATUS_LOADING,
  DAO_STATUS_UNLOADED,
])

export const FavoriteDaoType = PropTypes.shape({
  name: PropTypes.string,
  address: EthereumAddressType,
  favorited: PropTypes.bool,
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

export const RepoVersionType = PropTypes.shape({
  content: RepoContentType.isRequired,
  version: PropTypes.string.isRequired,
})

export const RepoType = PropTypes.shape({
  appId: PropTypes.string.isRequired,
  currentVersion: RepoVersionType,
  latestVersion: RepoVersionType.isRequired,
  repoAddress: EthereumAddressType.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      contentURI: PropTypes.string.isRequired,
      contractAddress: PropTypes.string.isRequired,
      timestamp: PropTypes.number,
      version: PropTypes.string.isRequired,
      versionId: PropTypes.string.isRequired,
    })
  ).isRequired,
})

export const ReposListType = PropTypes.arrayOf(RepoType)

// https://github.com/react-spring/react-spring/blob/31200a79843ce85200b2a7692e8f14788e60f9e9/types/renderprops-universal.d.ts#L133
export const ReactSpringStateType = PropTypes.oneOf([
  'enter',
  'update',
  'leave',
])

// see ethereum-providers/
export const EthereumProviderType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
})

// see templates/
const OrgTemplateAppType = PropTypes.shape({
  appName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
})
export const OrgTemplateType = PropTypes.shape({
  apps: PropTypes.arrayOf(OrgTemplateAppType.isRequired),
  caseStudyUrl: PropTypes.string,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  header: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  longDesc: PropTypes.string,
  name: PropTypes.string.isRequired,
  optionalApps: PropTypes.arrayOf(OrgTemplateAppType.isRequired),
  prepareTransactions: PropTypes.func,
  registry: PropTypes.string,
  screens: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func]))
  ),
  sourceCodeUrl: PropTypes.string,
  userGuideUrl: PropTypes.string,
})

// The status of a single transaction (only used to deploy an org for now).
// The “upcoming” status is used to indicate that the transaction is waiting
// for another one to be mined before being processed.
export const TransactionStatusType = PropTypes.oneOf([
  TRANSACTION_STATUS_ERROR,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SUCCESS,
  TRANSACTION_STATUS_UPCOMING,
])

// See src/wallet.js
export const WalletType = PropTypes.shape({
  account: PropTypes.string,
  balance: PropTypes.object.isRequired,
  chainId: PropTypes.number.isRequired,
  enable: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  isContract: PropTypes.bool.isRequired,
  networkType: PropTypes.string.isRequired,
  providerInfo: PropTypes.object.isRequired,
  web3: PropTypes.object.isRequired,
})

export const AragonUiAppearanceType = PropTypes.oneOf(['dark', 'light'])

export const AragonUiThemeType = PropTypes.oneOf([
  PropTypes.string,
  PropTypes.shape({
    _name: PropTypes.string.isRequired,
    _appearance: AragonUiAppearanceType.isRequired,
  }),
])

export const ClientThemeType = PropTypes.shape({
  theme: AragonUiThemeType,
  appearance: AragonUiAppearanceType.isRequired,
})
