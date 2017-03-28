// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'
import { TemplateVar } from 'meteor/frozeman:template-var'

import Identity from '/client/lib/identity'
import ClosableSection from '/client/tmpl/components/closableSection'
import renderOwnershipInfo from './entityCharts'
import StockWatcher from '/client/lib/ethereum/stocks'
import Tokens from '/client/lib/ethereum/tokens'
import { Stock } from '/client/lib/ethereum/contracts'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_Entity.extend([ClosableSection])

tmpl.onCreated(async function () {
  const entity = await Identity.get(FlowRouter.current().params.address)
  TemplateVar.set(this, 'entity', entity)
})

const reloadBalances = async ethereumAddress => {
  const stocks = Stocks.find().fetch()
  for (const stock of stocks) {
    await StockWatcher.setBalance(ethereumAddress, stock.address)
  }
}

tmpl.onRendered(function () {
  renderOwnershipInfo()
  reloadBalances(FlowRouter.current().params.address)
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  balance: (stock, ethereumAddress) => {
    const entity = Entities.findOne({ ethereumAddress })
    if (!entity || !entity.balances) return 0
    return entity.balances[stock] || 0
  },
  transferrable: ReactivePromise(Tokens.getTransferableBalance),
})

tmpl.events({
  'click #wrap': (e) => {
    const element = $(e.currentTarget)
    Tokens.wrap(element.data('parent'), element.data('wrapper'), element.data('holder'))
  },
  'click #unwrap': (e) => {
    const element = $(e.currentTarget)
    Tokens.unwrap(element.data('wrapper'), element.data('holder'))
  }
})
