import Web3 from 'web3'
import {
  getDefaultEthNode,
  getEthNetworkType,
  getIpfsGateway,
} from './local-settings'
import { getNetworkConfig } from './network-config'

// TODO: make all these depend on env variables / URL

export const appIds = {
  Finance: '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
  TokenManager:
    '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
  Vault: '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
  Voting: '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
}

const appsOrder = ['TokenManager', 'Finance', 'Voting', 'Vault']

// Utility to sort a pair of apps (to be used with Array.prototype.sort)
export const sortAppsPair = (app1, app2) => {
  const index1 = appsOrder.indexOf(app1.appId)
  const index2 = appsOrder.indexOf(app2.appId)

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

  // Otherwise, alphabetical order
  const id1 = app1.appId.toLowerCase()
  const id2 = app2.appId.toLowerCase()
  if (id1 < id2) {
    return -1
  }
  if (id1 > id2) {
    return 1
  }
  return 0
}

let appLocator
let appOverrides

if (process.env.NODE_ENV !== 'production') {
  /******************
   * Local settings *
   ******************/
  appLocator = {
    [appIds['Finance']]: 'http://localhost:3002/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
    [appIds['Voting']]: 'http://localhost:3001/',
  }
  appOverrides = {
    [appIds['Finance']]: {
      script: '/script.js',
      start_url: '/index.html',
    },
    [appIds['TokenManager']]: {
      script: '/script.js',
      start_url: '/index.html',
    },
    [appIds['Voting']]: {
      script: '/script.js',
      start_url: '/index.html',
    },
  }
} else {
  /***********************
   * Production settings *
   ***********************/
  appLocator = {
    [appIds['Finance']]: 'https://finance.aragonpm.com/',
    [appIds['TokenManager']]: 'https://token-manager.aragonpm.com/',
    [appIds['Voting']]: 'https://voting.aragonpm.com/',
  }
  appOverrides = {}
}

export { appLocator, appOverrides }

export const ipfsDefaultConf = {
  gateway: getIpfsGateway(),
  rpc: {
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  },
}

const expectedNetworkType = getEthNetworkType()
const networkConfig = getNetworkConfig(expectedNetworkType)
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
      'This app was built to connect to an unsupported network. You most likely need to change your network environment variables.'
    )
  }
}

export const web3Providers = {
  default: new Web3.providers.WebsocketProvider(getDefaultEthNode()),
  wallet: window.web3 && window.web3.currentProvider,
}
