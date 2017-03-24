// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_Stocks.extend([ClosableSection])

tmpl.onCreated(() => {
  TemplateVar.set('selectedStock', 0)
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  selectedStock: ReactivePromise(() => (Stocks.find().fetch()[TemplateVar.get('selectedStock')])),
})

tmpl.events({
  'change select': (e) => {
    TemplateVar.set('selectedStock', e.target.value)
    setTimeout(() => (this.$('.tooltip').popup()), 500)
  },
})
