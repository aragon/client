// @flow
import { $ } from 'meteor/jquery'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'
import EthereumNode from '/client/lib/ethereum/node'
import Company from '/client/lib/ethereum/deployed'
import { BrowserNotifications } from '/client/lib/notifications'

const initFinished = new ReactiveVar(false)
const isInjectedMetaMask = new ReactiveVar(false)

Template.Layout.helpers({
  initFinished: () => initFinished.get(),
  isInjectedMetaMask: () => isInjectedMetaMask.get(),
})

const load = async () => {
  Meteor.disconnect()

  if (Company().address !== Session.get('knownCompany')) {
    localStorage.clear()
    Session.setPersistent('knownCompany', Company().address)
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

const injectMetaMask = async () => {
  const contentScriptReq = await fetch('metamask://app/scripts/contentscript.js')
  const blob = await contentScriptReq.blob()
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = URL.createObjectURL(blob)
  document.getElementsByTagName('head')[0].appendChild(s)
  return true
}

const loadMetaMask = async () => {
  Template.Layout_MetaMask.onRendered(async function () {
    console.log('MetaMask: Template rendered')
    await injectMetaMask()
    console.log('MetaMask: Injected')
    this.$('#Layout_MetaMask').load(() => {
      console.log('MetaMask: Iframe loaded')
      window._setupMetaMaskPageStream(this.$('#Layout_MetaMask')[0])
      load()
    })
  })
}

if (window.injectMetaMask) {
  isInjectedMetaMask.set(true)
  loadMetaMask()
} else {
  Meteor.startup(() => load())
}
