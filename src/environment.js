import Web3 from 'web3'
import provider from 'eth-provider'
import {
  getAppLocator,
  getDefaultEthNode,
  getEthNetworkType,
  getIpfsGateway,
} from './local-settings'
import { getNetworkConfig } from './network-config'
import { noop } from './utils'
import { toWei, getInjectedProvider } from './web3-utils'

const appsOrder = ['TokenManager', 'Voting', 'Finance', 'Vault', 'Agent']
const networkType = getEthNetworkType()

export const appIds = {
  Agent: '0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a',
  Finance: '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
  TokenManager:
    '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
  Storage: '0xa53eae0295e6028e828951e8a5a05c14acb4d7bc636d130658894dd48b93ec9a',
  Survey: '0x030b2ab880b88e228f2da5a3d19a2a31bc10dbf91fb1143776a6de489389471e',
  Vault: '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
  Voting: '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
}

// Utility to sort a pair of apps (to be used with Array.prototype.sort)
export const sortAppsPair = (app1, app2) => {
  const pairs = Object.entries(appIds)
  const [name1] = pairs.find(([_, id]) => id === app1.appId) || []
  const [name2] = pairs.find(([_, id]) => id === app2.appId) || []
  const index1 = name1 ? appsOrder.indexOf(name1) : -1
  const index2 = name2 ? appsOrder.indexOf(name2) : -1

  // Keep kernel first
  if (app1.name === 'Kernel') {
    return -1
  }
  if (app2.name === 'Kernel') {
    return 1
  }

  // Internal apps first
  if (app1.isAragonOsInternalApp !== app2.isAragonOsInternalApp) {
    return app1.isAragonOsInternalApp ? -1 : 1
  }

  // Try to sort it if the app exists in the list
  if (index1 === -1 && index2 > -1) {
    return 1
  }
  if (index1 > -1 && index2 === -1) {
    return -1
  }
  if (index1 > -1 && index2 > -1) {
    return index1 - index2
  }

  // Missing app name
  if (!(app1.name && app2.name)) {
    return 0
  }

  // Otherwise, alphabetical order
  const unknownName1 = app1.name.toLowerCase()
  const unknownName2 = app2.name.toLowerCase()
  if (unknownName1 === unknownName2) {
    return 0
  }
  return unknownName1 < unknownName2 ? -1 : 1
}

// Use appOverrides to override specific keys in an app instance, e.g. the start_url or script location
const appOverrides = {
  // Needed to change app name on sidebar for old versions whose aragonPM repo content cannot be changed anymore
  [appIds['TokenManager']]: { name: 'Tokens' },
}

const appLocator = {}
const appLocatorString = getAppLocator()
if (appLocatorString === 'local') {
  /******************
   * Local settings *
   ******************/
  Object.assign(appLocator, {
    [appIds['Agent']]: 'http://localhost:3005/',
    [appIds['Finance']]: 'http://localhost:3002/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
    [appIds['Survey']]: 'http://localhost:3004/',
    [appIds['Voting']]: 'http://localhost:3001/',
  })
} else if (appLocatorString === 'ipfs') {
  // We don't need to provide anything here as by default, the apps will be loaded from IPFS
} else if (appLocatorString) {
  console.error(
    `The specified app locator (${appLocatorString}) in the configuration is not one of 'ipfs', or 'local'. Defaulting to using 'ipfs'.`
  )
}
export { appLocator, appOverrides }

export const ipfsDefaultConf = {
  gateway: getIpfsGateway(),
}

const networkConfig = getNetworkConfig(networkType)
export const network = networkConfig.settings

export const contractAddresses = {
  ensRegistry: networkConfig.addresses.ensRegistry,
}
if (process.env.NODE_ENV !== 'production') {
  if (Object.values(contractAddresses).some(address => !address)) {
    // Warn if any contracts are not given addresses in development
    console.error(
      'Some contracts are missing addresses in your environment! You most likely need to specify them as environment variables.'
    )
    console.error('Current contract address configuration', contractAddresses)
  }
  if (network.type === 'unknown') {
    console.error(
      'This app was configured to connect to an unsupported network. You most likely need to change your network environment variables.'
    )
  }
}

export const defaultEthNode =
  getDefaultEthNode() || networkConfig.nodes.defaultEth

export const web3Providers = {
  default: new Web3.providers.WebsocketProvider(defaultEthNode),
  // Only use eth-provider to connect to frame if no injected provider is detected
  wallet: getInjectedProvider() || provider(['frame']),
}

export const defaultGasPriceFn =
  networkType === 'main'
    ? noop // On mainnet rely on the provider's gas estimation
    : () => toWei('10', 'gwei') // on all other networks just hardcode it
