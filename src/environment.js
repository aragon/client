import Web3 from 'web3'

// TODO: make all these depend on env variables / URL

export const addresses = {
  // ensRegistry: '0x409ba3dd291bb5d48d5b4404f5efa207441f6cba',
  ensRegistry: '0x3635266b73b71760c3a193619cfc123245f37554',
}

export const appIds = {
  // TODO: add vault and finance
  Voting: '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
  Vault: '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
}

export const appDefaults = {}

export const appLocator = {
  [appIds['Voting']]: 'http://localhost:3001/',
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
  default: new Web3.providers.WebsocketProvider('ws://localhost:8546'),
  wallet: window.web3 && window.web3.currentProvider,
}
