// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'
import { TemplateVar } from 'meteor/frozeman:template-var'

import Identity from '/client/lib/identity'
import ClosableSection from '/client/tmpl/components/closableSection'
import renderOwnershipInfo from './entityCharts'
import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_Entity.extend([ClosableSection])

tmpl.onCreated(async function () {
  const entity = await Identity.get(FlowRouter.current().params.address)
  TemplateVar.set(this, 'entity', entity)
})

tmpl.onRendered(function () {
  renderOwnershipInfo()
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
})
