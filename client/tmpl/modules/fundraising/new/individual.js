// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'
import { moment } from 'meteor/momentjs:moment'
import { web3 } from 'meteor/ethereum:web3'

import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import StockSaleWatcher from '/client/lib/ethereum/stocksales'
import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Fundraising_New_Individual.extend([ClosableSection])

tmpl.onRendered(function () {
  TemplateVar.set('selectedStock', -1)

  this.$('.dropdown').dropdown({
    onChange: (v) => TemplateVar.set(self, 'selectedStock', +v),
  })
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const title = this.$('input[name=title]').val()
      const selectedStock = TemplateVar.get(this, 'selectedStock')
      const investor = TemplateVar.get(this, 'recipient').ethereumAddress
      const price = web3.toWei(this.$('input[name=price]').val(), 'ether')

      const units = this.$('input[name=units]').val()
      const closes = +moment(this.$('[type=date]').val()) / 1000

      const address = Identity.current(true).ethereumAddress

      console.log('creating with investor', investor)
      await StockSaleWatcher.createIndividualInvestorVote(
        address, selectedStock, investor, price, units, closes, title)

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  selectedRecipient: () => (TemplateVar.get('recipient')),
  entity: ReactivePromise(Identity.get),
  stocks: () => Stocks.find(),
  defaultAddress: () => Identity.current(true).ethereumAddress,
  availableShares: ReactivePromise((selectedStock) => {
    const stock = Stocks.findOne({ index: +selectedStock })
    if (!stock) { return Promise.reject() }
    return Stock.at(stock.address).balanceOf(Company.address).then(x => x.valueOf())
  }, '', '0'),
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/fundraising'),
})
