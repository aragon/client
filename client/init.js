// @flow
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'
import EthereumNode from '/client/lib/ethereum/node'
import { BrowserNotifications } from '/client/lib/notifications'

const initFinished = new ReactiveVar(false)

Template.Layout.helpers({
  initFinished: () => initFinished.get(),
})

const load = async () => {
  await EthereumNode.connect()
  const current = Identity.current(true)
  if (!current) {
    await Identity.reset()
    Settings.reset()
  }
  await EthereumNode.bindListeners()
  BrowserNotifications.requestPermission()

  initFinished.set(true)
}

Session.set('isMetamask', false)

if (Session.get('isMetamask')) {
  Template.Layout_MetaMask.onRendered(function () {
    this.$('#Layout_MetaMask').load(async () => {
      window._setupMetaMaskPageStream(this.$('#Layout_MetaMask')[0])
      load()
    })
  })
} else {
  Meteor.startup(() => load())
}
