if (Meteor.settings.public.landingNode) {
  window.web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.landingNode))
} else {
  // window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  window.injectMetaMask = (typeof web3 === 'undefined' && !Meteor.settings.public.noMetamask)
}

export default web3
