// @flow
import { $ } from 'meteor/jquery'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'
import EthereumNode from '/client/lib/ethereum/node'
import { Company } from '/client/lib/ethereum/deployed'
import { BrowserNotifications } from '/client/lib/notifications'

const initFinished = new ReactiveVar(false)

Template.Layout.helpers({
  initFinished: () => initFinished.get(),
})

const load = async () => {
  Meteor.disconnect()

  if (Company.address !== Session.get('knownCompany')) {
    localStorage.clear()
    Session.setPersistent('knownCompany', Company.address)
  }

  await EthereumNode.connect()
  const current = Identity.current(true)
  if (!current) {
    await Identity.reset()
    Settings.reset()
  }
  await EthereumNode.bindListeners()
  BrowserNotifications.requestPermission()

  initFinished.set(true)
  $('#initialDimmer').remove()
}

const isMetamask = true

if (isMetamask) {
  Template.Layout_MetaMask.onRendered(function () {
    this.$('#Layout_MetaMask').load(async () => {
      window._setupMetaMaskPageStream(this.$('#Layout_MetaMask')[0])
      load()
    })
  })
} else {
  Meteor.startup(() => load())
}
