import coinr from 'coinr'

import Identity from '/client/lib/identity'

Template.registerHelper('$contains', (a, b) => (!a || b.toLowerCase().indexOf(a.toLowerCase()) !== -1))

Template.registerHelper('parent', () => ({ parent: Template.instance() }))

Template.registerHelper('displayAddress', (ethAddress) => {
  if (ethAddress === EthAccounts.findOne().address) {
    return 'Me'
  }
  return ethAddress
})

Template.registerHelper('currentEntity', ReactivePromise(() => {
  if (!web3.isConnected()) return {}
  return Identity.current()
}))

Template.registerHelper('entityName', ReactivePromise(async (address) => {
  if (!web3.isConnected()) return {}
  const identity = await Identity.get(address)
  return identity.name
}))

Template.registerHelper('ticker', ReactivePromise((currency) => coinr(currency)))

Template.registerHelper('traditionalCurrency', ReactivePromise(async (ethAmount) => {
  const eth = await coinr('eth')
  console.log(eth)
  return ethAmount * parseFloat(eth.price_usd)
}))

Template.registerHelper('online', () => navigator.onLine)

Template.registerHelper('currentAccount', ReactivePromise(async () => {
  const entity = await Identity.current()
  console.log(entity)
  return EthAccounts.findOne({ address: entity.ethereumAddress })
}))
