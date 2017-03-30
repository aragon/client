// @flow
import Build from '/client/lib/build'

const isDev = location.origin.indexOf('localhost') > -1
const isClient = location.origin.indexOf('aragon://') > -1

window.injectMetaMask = isClient || isDev

console.log('[Aragon] Injecting metamask for:', location.origin, isClient, isDev)

if (typeof web3 === 'undefined' && !window.injectMetaMask) {
  alert('Your browser is not web3 compatible, which means Aragon cannot connect to the Ethereum network and therefore cannot run. Visit https://aragon.one to download the client for your OS or use https://metamask.io for Chrome.')
}

export default window.web3
