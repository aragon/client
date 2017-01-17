// @flow
import { Template } from 'meteor/templating'
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import { IssueStockVoting } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'
import Identity from '/client/lib/identity'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_IssueShares.extend([ClosableSection])

const issueStock = async (kind, value) => {
  const addr = Identity.current(true).ethereumAddress
  const oneWeekFromNow = +moment().add(7, 'days') / 1000
  const voting = await IssueStockVoting.new(kind, value,
                        { from: addr, gas: 1500000 })
  await voting.setTxid(voting.transactionHash, { from: addr, gas: 150000 })
  return await Company.beginPoll(voting.address, oneWeekFromNow,
                { from: addr, gas: 120000 * Stocks.find().count() })
}

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      await issueStock(this.$('input[name=kind]').val(), this.$('input[name=number]').val())
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
