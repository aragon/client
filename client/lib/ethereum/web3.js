// @flow

import Build from '/client/lib/build'

console.log(Build.Settings.get('landingNode'))

if (Build.Settings.get('landingNode')) {
  window.web3 = new Web3(new Web3.providers.HttpProvider(Build.Settings.get('landingNode')))
} else {
  // window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  window.injectMetaMask = (typeof web3 === 'undefined' && !Build.Settings.get('noMetamask'))
}

export default window.web3
