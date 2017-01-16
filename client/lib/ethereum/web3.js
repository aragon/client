import Web3 from 'web3'

if (typeof web3 !== 'undefined') {
  // web3 = new Web3(web3.currentProvider)
  // web3 = $('#Layout_MetaMask')[0].contentWindow.web3
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

export default web3
