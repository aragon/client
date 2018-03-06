import Web3 from 'web3'

// TODO: make all these depend on env variables / URL

export const addresses = {
  ensRegistry: '0x409ba3dd291bb5d48d5b4404f5efa207441f6cba',
}

export const appLocator = {
  voting: 'http://localhost:3001/',
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
  default: new Web3.providers.WebsocketProvider('ws://localhost:8545'),
  wallet: window.web3 && window.web3.currentProvider,
}
