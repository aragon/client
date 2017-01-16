// @flow
import { Meteor } from 'meteor/meteor'
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

Meteor.startup(async () => {
  // Meteor.disconnect()

  await EthereumNode.connect()
  console.log('Connected')

  const current = Identity.current(true)
  if (!current) {
    await Identity.reset()
    Settings.reset()
  }
  await EthereumNode.bindListeners()
  BrowserNotifications.requestPermission()

  initFinished.set(true)
})
