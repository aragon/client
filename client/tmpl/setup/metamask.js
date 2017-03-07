// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { $ } from 'meteor/jquery'

import Identity from '/client/lib/identity'
import { faucets } from '/client/lib/ethereum/networks'
import TxQueue from '/client/lib/queue'

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
      _.throttle(account => {
        if (account.balance < 1) {
          faucetForAddress(account.address)
        }
      }, 10000)(getAccount())
    }
  })
})

const faucetForAddress = (address, delay = 250) => {
  const faucet = faucets[Session.get('network')]
  if (!faucet) return

  const url = faucet(address)
  console.log('Requesting ether to faucet for account', address, url)

  HTTP.call('GET', url, (err, success) => {
    if (err) setTimeout(() => faucetForAddress(address, delay * 200), Math.min(delay, 1000000))
    console.log('faucet', err, success)
    if (success && success.data) TxQueue.add(success.data.txID)
  })
}

const getNetworkID = () => (
  new Promise((resolve, reject) => {
    web3.version.getNetwork((err, id) => {
      if (err) reject(err)
      else resolve(parseInt(id))
    })
  })
)

const supportedNetworks = [3, 15, 42]

const isInWrongNetwork = async () => !_.contains(supportedNetworks, await getNetworkID())

const canContinue = async () =>
  getAccount().balance > 0 && !(await isInWrongNetwork())

const getAccount = () => EthAccounts.findOne()

tmpl.helpers({
  account: getAccount,
  networkID: ReactivePromise(getNetworkID),
  canContinue: ReactivePromise(canContinue),
  isButtonEnabled: ReactivePromise(async () => {
    return (await canContinue()) ? '' : 'disabled'
  }),
  isInWrongNetwork: ReactivePromise(isInWrongNetwork),
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
