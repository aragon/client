// @flow
import { Template } from 'meteor/templating'
import { ReactivePromise } from 'meteor/deanius:promise'
import { EthAccounts } from 'meteor/ethereum:accounts'
import { moment } from 'meteor/momentjs:moment'

import Ticker from '/client/lib/currency/ticker'
import web3 from '/client/lib/ethereum/web3'
import Identity from '/client/lib/identity'
import type { Entity } from '/client/lib/identity/entity'
import Settings from '/client/lib/settings'
import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'

Template.registerHelper('$contains', (a, b) => (!a || b.toLowerCase().indexOf(a.toLowerCase()) !== -1))

Template.registerHelper('parent', () => ({ parent: Template.instance() }))

Template.registerHelper('currentEntity', ReactivePromise(() => {
  if (!web3.isConnected()) return {}
  return Identity.current()
}))

Template.registerHelper('currentEntityName', ReactivePromise(() => {
  if (!web3.isConnected()) return {}
  return Identity.current(false, false).name.split(' ')[0]
}))

Template.registerHelper('getEntity', ReactivePromise(async (address) => {
  if (!web3.isConnected()) return {}
  const identity = await Identity.get(address)
  return identity
}))

Template.registerHelper('entityName', ReactivePromise(async (address) => {
  if (!web3.isConnected()) return {}
  const identity = await Identity.get(address)
  return identity.name
}))

Template.registerHelper('currentAccount', ReactivePromise(() => {
  const entity = Identity.current()
  return EthAccounts.findOne({ address: entity.ethereumAddress })
}))

Template.registerHelper('ticker', ReactivePromise((currency: string) => Ticker.get(currency)))

Template.registerHelper('traditionalCurrency', ReactivePromise(async (ethAmount) => {
  const eth = await Ticker.get('ETH')
  return (ethAmount * parseFloat(eth.price)).toFixed(2)
}))

Template.registerHelper('Settings', () => ({
  get: ReactivePromise(key => Settings.get(key)),
}))

Template.registerHelper('online', () => navigator.onLine)

Template.registerHelper('capitalize', (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
})

Template.registerHelper('totalStock', ReactivePromise(async (entity: Entity) => {
  const stocksArr = StockWatcher.Stocks.find().fetch().map((item) =>
    Stock.at(item.address).balanceOf(entity.ethereumAddress))
  const stocks = await Promise.all(stocksArr)
  const totalStock: number = stocks.map(s => s.toNumber()).reduce((a, b) => a + b, 0)
  return totalStock
}))

Template.registerHelper('formatDate', (timestamp: number) => (
  moment(timestamp*1000).calendar()
))
