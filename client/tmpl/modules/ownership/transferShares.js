// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { ReactivePromise } from 'meteor/deanius:promise'

import Identity from '/client/lib/identity'
import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import { dispatcher } from '/client/lib/action-dispatcher'

const Stocks = StockWatcher.Stocks

const transferStock = async (stockIndex: number, to: string, amount: number) => {
  const stockAddr = Stocks.findOne({ index: stockIndex }).address
  return await dispatcher.performTransaction(Stock.at(stockAddr).transfer, to, amount)
}

const tmpl = Template.Module_Ownership_TransferShares.extend([ClosableSection])

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown({
    onChange: v => TemplateVar.set(this, 'selectedStock', +v),
  })

  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const selectedStock = TemplateVar.get(this, 'selectedStock')
      const amount = this.$('input[name=number]').val()
      const recipient = TemplateVar.get(this, 'recipient').ethereumAddress

      await transferStock(selectedStock, recipient, amount)

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  balance: ReactivePromise(async (stockIndex) => {
    const stockAddr = Stocks.findOne({ index: stockIndex }).address
    const stock = await Stock.at(stockAddr).transferrable(Identity.current().ethereumAddress)
    return stock.toNumber()
  }),
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/ownership'),
})
