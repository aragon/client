// @flow
import { $ } from 'meteor/jquery'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import Build from '/client/lib/build'
import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'
import EthereumNode from '/client/lib/ethereum/node'
import TxQueue from '/client/lib/queue'
import { BrowserNotifications } from '/client/lib/notifications'
import { CompanyFactory, CompanyConfiguratorFactory } from '/client/lib/ethereum/contracts'

import Accounting from '/client/lib/ethereum/accounting'
import BylawsWatcher from '/client/lib/ethereum/bylaws'
import StatusWatcher from '/client/lib/ethereum/statuses'
import StockWatcher from '/client/lib/ethereum/stocks'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'
import VotingWatcher from '/client/lib/ethereum/votings'

import release from '../package.json'

const initFinished = new ReactiveVar(false)
const isInjectedMetaMask = new ReactiveVar(false)

Template.Layout.helpers({
  initFinished: () => initFinished.get(),
  isInjectedMetaMask: () => isInjectedMetaMask.get(),
})

const clearStorage = () => {
  console.log('Clearing storage')
  localStorage.clear()
  const collections = [
    StockWatcher.Stocks,
    Accounting.Transactions, Accounting.AccountingPeriods,
    BylawsWatcher.Bylaws,
    VotingWatcher.Votings,
    Entities,
    StockSalesWatcher.StockSales,
  ]
  collections.forEach(c => c.remove({}))
  localStorage.clear()
}

const load = async () => {
  Meteor.disconnect()

  if (localStorage.getItem('currentRelease') !== release.version) {
    alert("We will reset your storage in order to upgrade your Aragon version.")
    localStorage.clear()
    localStorage.setItem('currentRelease', release.version)
  }

  if (navigator.userAgent.includes('Electron')) {
    $(document.body).addClass('electron')
    window.isElectron = true
  }

  await EthereumNode.connect()

  // TODO: Solve this the proper way and remove this code
  window.CompanyFactory = await CompanyFactory.deployed()
  window.CompanyConfiguratorFactory = await CompanyConfiguratorFactory.deployed()

  const current = Identity.current(true)
  if (!current.ethereumAddress) {
    await Identity.reset()
    Settings.reset()
  }

  if (localStorage.getItem('companyAddress')) await EthereumNode.bindListeners()

  TxQueue.init()

  BrowserNotifications.requestPermission()

  initFinished.set(true)
  $('#initialDimmer').fadeOut('slow')

  console.log('Observing account changes')
  EthAccounts.find().observe({
    addedAt: async () => {
      if (EthAccounts.findOne().address != Identity.current(true).ethereumAddress) {
        console.log('Detected account change, reseting')
        await Identity.reset()
        location.reload()
      }
    }
  })
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
  FlowRouter.wait()
  Meteor.startup(() => {
    FlowRouter.initialize({ hashbang: true })
    load()
  })
}
