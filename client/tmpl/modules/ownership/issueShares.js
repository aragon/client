// @flow
import { Template } from 'meteor/templating'
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import { IssueStockVoting } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'
import Identity from '/client/lib/identity'

import { dispatcher, actions } from '/client/lib/action-dispatcher'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_IssueShares.extend([ClosableSection])

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      console.log(dispatcher, dispatcher.dispatch)
      
      await dispatcher.dispatch(actions.issueStock, this.$('input[name=kind]').val(), this.$('input[name=number]').val())
      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  stocks: () => Stocks.find(),
})

tmpl.events({
  'success .dimmer': () => FlowRouter.go('/ownership'),
})
