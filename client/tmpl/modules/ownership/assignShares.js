// @flow
import { Template } from 'meteor/templating'
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_AssignShares.extend([ClosableSection])

const assignStock = (kind, value, recipient) => (
  dispatcher.dispatch(actions.grantStock, kind, value, recipient)
)

const createStockGrant = async (kind, value, recipient, cliff, vesting) => (
  dispatcher.dispatch(actions.grantVestedStock, kind, value, recipient, +moment(cliff)/1000, +moment(vesting)/1000)
)

tmpl.onRendered(function () {
  TemplateVar.set('assignMode', true)

  this.$('.dropdown').dropdown({
    onChange: (v) => TemplateVar.set(this, 'selectedStock', +v),
  })
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const selectedStock = TemplateVar.get(this, 'selectedStock')
      const amount = this.$('input[name=number]').val()
      const recipient = TemplateVar.get(this, 'recipient').ethereumAddress

      if (TemplateVar.get(this, 'assignMode')) {
        await assignStock(selectedStock, amount, recipient)
      } else {
        const cliff = this.$('input[name=cliff]').val()
        const vesting = this.$('input[name=vesting]').val()

        await createStockGrant(selectedStock, amount, recipient, cliff, vesting)
      }

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  selectedRecipient: () => (TemplateVar.get('recipient')),
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
  'success .dimmer': () => FlowRouter.go('/ownership'),
  'click #stockGrant': () => TemplateVar.set('assignMode', !TemplateVar.get('assignMode')),
})
