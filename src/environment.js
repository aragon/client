import Web3 from 'web3'

// TODO: make all these depend on env variables / URL

export const addresses = {
  // ensRegistry: '0x409ba3dd291bb5d48d5b4404f5efa207441f6cba',
  ensRegistry: '0x3635266b73b71760c3a193619cfc123245f37554',
}

export const appIds = {
  Finance: '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
  TokenManager:
    '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
  Vault: '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
  Voting: '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
}

export const appDefaults = {
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

// Uncomment these to load apps from local servers
export const appLocator = {
  // [appIds['Finance']]: 'http://localhost:3002/',
  // [appIds['TokenManager']]: 'http://localhost:3003/',
  // [appIds['Voting']]: 'http://localhost:3001/',
}

export const contractAddresses = {
  ensRegistry: '0xaa0ccb537289d226941745c4dd7a819a750897d0',
}

export const ipfsDefaultConf = {
  gateway: 'https://gateway.ipfs.io/ipfs',
  rpc: {
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  },
}

export const web3Providers = {
  default: new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'),
  wallet: window.web3 && window.web3.currentProvider,
}
