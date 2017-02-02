import Web3 from 'web3'

if (typeof web3 !== 'undefined') {
  // web3 = new Web3(web3.currentProvider)
} else {
  window.injectMetaMask = true
  // set the provider you want from Web3.providers
  // console.log('HTTP PROVIDER')
  // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  // web3 = new Web3()
}

// Disable metamask
window.injectMetaMask = false

if (Meteor.settings.public.landingNode) {
  window.web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.landingNode))
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

// export default web3
