// @flow
import Build from '/client/lib/build'

window.injectMetaMask = (typeof web3 === 'undefined' && !Build.Settings.get('noMetamask'))

export default window.web3
