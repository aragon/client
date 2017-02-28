// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { $ } from 'meteor/jquery'

import Identity from '/client/lib/identity'

const tmpl = Template.Setup_MetaMask

const toggleMetaMask = (show: boolean = true) => {
  const metaMask = $('#Layout_MetaMask')
  const toggleClass = (show) ? 'hidden' : 'visible'
  if (metaMask.hasClass(toggleClass)) {
    metaMask.transition('fade down')
  }
}

tmpl.onRendered(function (){
  this.autorun(() => {
    const accounts = EthAccounts.find()
    if (accounts.count() > 0) {
      if (!Entities.findOne({current: true})) Identity.reset()
      $('#setupMetaMask').text('Continue').attr('id', 'continue')
      // toggleMetaMask(false)
      const account = getAccount()
      if (account.balance < 1 || true) {
        faucetForAddress(account.address)
      }
    }
  })
})

const faucetForAddress = (address, delay = 250) => {
  console.log('Requesting ether to faucet for account', address)
  HTTP.call('GET', `http://faucet.ropsten.be:3001/donate/${address}`, (err, success) => {
    if (err) setTimeout(() => faucetForAddress(address, delay * 2), Math.min(delay, 10000))
  })
}

const getNetworkID = () => (
  new Promise((resolve, reject) => {
    web3.version.getNetwork((err, id) => {
      if (err) reject(err)
      else resolve(id)
    })
  })
)

const canContinue = async () =>
  getAccount().balance > 0 && (await getNetworkID()) == deployedNetwork

const getAccount = () => EthAccounts.findOne()
const deployedNetwork = 3 // ROPSTEN

tmpl.helpers({
  account: getAccount,
  networkID: ReactivePromise(getNetworkID),
  canContinue: ReactivePromise(canContinue),
  isButtonEnabled: ReactivePromise(async () => {
    return (await canContinue()) ? '' : 'disabled'
  })
})

tmpl.events({
  'click #setupMetaMask': (e) => {
    window.postMessage({ metaMask: 'show' }, '*')
    toggleMetaMask(true)
  },
  'click #continue': (e, tmplIns) => (
    TemplateVar.setTo('#setup', 'step', 'Setup_Welcome')
  ),
})
