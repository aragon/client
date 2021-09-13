// module.exports = require("@aragon/os/truffle-config")
const homedir = require('os').homedir
const path = require('path')

const HDWalletProvider = require('@truffle/hdwallet-provider')

const DEFAULT_MNEMONIC =
  'explain tackle mirror kit van hammer degree position ginger unfair soup bonus'

const defaultRPC = network => `https://${network}.eth.aragon.network`

const configFilePath = filename => path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
  try {
    return require(configFilePath('mnemonic.json')).mnemonic
  } catch (e) {
    return DEFAULT_MNEMONIC
  }
}

const settingsForNetwork = network => {
  try {
    return require(configFilePath(`${network}_key.json`))
  } catch (e) {
    return {}
  }
}

// Lazily loaded provider
const providerForNetwork = network => () => {
  let { rpc, keys } = settingsForNetwork(network)
  rpc = rpc || defaultRPC(network)

  if (!keys || keys.length === 0) {
    return new HDWalletProvider(mnemonic(), rpc)
  }
  return new HDWalletProvider(keys, rpc)
}

const mochaGasSettings = {
  reporter: 'eth-gas-reporter',
  reporterOptions: {
    currency: 'USD',
    gasPrice: 3,
  },
}

const mocha = process.env.GAS_REPORTER ? mochaGasSettings : {}

module.exports = {
    networks: {
        rpc: {
            network_id: 15,
            host: 'localhost',
            port: 8545,
            gas: 6.9e6,
            gasPrice: 15000000001,
        },
        harmony: {
          network_id: 1666600000,
          provider: providerForNetwork('harmony'),
          gas: 17000000
        },
        harmonyTest: {
          network_id: 1666700000,
          provider: providerForNetwork('harmonyTest'),
          gas: 17000000
        }
    },
    build: {},
    mocha,
    solc: {
        optimizer: {
            // See the solidity docs for advice about optimization and evmVersion
            // https://solidity.readthedocs.io/en/v0.5.12/using-the-compiler.html#setting-the-evm-version-to-target
            enabled: true,
            runs: 10000,   // Optimize for how many times you intend to run the code
        },
    },
}
