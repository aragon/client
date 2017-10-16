/* global web3 */

import Web3 from 'web3'
import { Provider } from './provider'
import { Messenger } from './messenger'

if (typeof web3 === 'undefined') {
  const messenger = new Messenger()
  const provider = new Provider({ messenger })

  window.web3 = new Web3(provider)
} else if (web3.currentProvider) {
  web3 = new Web3(web3.currentProvider)
}
