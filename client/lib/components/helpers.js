// @flow
import { Template } from 'meteor/templating'
import { ReactivePromise } from 'meteor/deanius:promise'
import { EthAccounts } from 'meteor/ethereum:accounts'
import coinr from 'coinr'

import web3 from '/client/lib/ethereum/web3'
import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'

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

Template.registerHelper('ticker', ReactivePromise((currency) => coinr(currency)))

Template.registerHelper('traditionalCurrency', ReactivePromise(async (ethAmount) => {
  const eth = await coinr('eth')
  return (ethAmount * parseFloat(eth.price_usd)).toFixed(2)
}))

Template.registerHelper('Settings', () => ({
  get: ReactivePromise(key => Settings.get(key)),
}))

Template.registerHelper('online', () => navigator.onLine)
