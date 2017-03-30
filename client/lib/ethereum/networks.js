const domains = {
  1: '',
  3: 'ropsten.',
  15: 'PRIVATECHAIN.',
  42: 'kovan.',
}

const names = {
  1: 'Ethereum mainnet',
  3: 'Ropsten testnet',
  15: 'PRIVATE CHAINS ARE BEST CHAINS',
  42: 'Kovan testnet',
}

const keybaseSuffixes = {
  1: '',
  3: '_ropsten',
  15: '_dev',
  42: '_kovan',
}

const faucets = {
  1: () => null,
  3: address => `http://faucet.ropsten.be:3001/donate/${address}`,
  15: () => null,
  42: address => `https://kovan-faucet.aragon.one/address/${address}`,
}

const supportedNetworks = [ 3, 15, 42 ]

export { domains, names, keybaseSuffixes, faucets, supportedNetworks }
