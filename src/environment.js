import Web3 from 'web3'
import { makeEtherscanBaseUrl } from './utils'

// TODO: make all these depend on env variables / URL

export const appIds = {
  Finance: '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
  TokenManager:
    '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
  Vault: '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
  Voting: '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
}

let appDefaults
let appLocator

if (process.env.NODE_ENV !== 'production') {
  /******************
   * Local settings *
   ******************/
  appDefaults = {
    [appIds['Finance']]: {
      script: '/script.js',
      short_url: '/index.html',
    },
    [appIds['TokenManager']]: {
      script: '/script.js',
      short_url: '/index.html',
    },
    [appIds['Voting']]: {
      script: '/script.js',
      short_url: '/index.html',
    },
  }

  appLocator = {
    [appIds['Finance']]: 'http://localhost:3002/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
    [appIds['Voting']]: 'http://localhost:3001/',
  }
} else {
  /***********************
   * Production settings *
   ***********************/
  appDefaults = {}
  appLocator = {
    [appIds['Finance']]: 'https://finance.aragonpm.com/',
    [appIds['TokenManager']]: 'https://token-manager.aragonpm.com/',
    [appIds['Voting']]: 'https://voting.aragonpm.com/',
  }
}

export { appDefaults, appLocator }

export const contractAddresses = {
  // Aragon's Rinkeby ENS
  ensRegistry: '0xfbae32d1cde62858bc45f51efc8cc4fa1415447e',
}

export const ipfsDefaultConf = {
  gateway: 'https://gateway.ipfs.io/ipfs',
  rpc: {
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  },
}

export const network = {
  chainId: 4,
  etherscanBaseUrl: makeEtherscanBaseUrl('rinkeby'),
  name: 'Rinkeby testnet',
}

export const web3Providers = {
  default: new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'),
  wallet: window.web3 && window.web3.currentProvider,
}
