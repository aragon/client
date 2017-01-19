// @flow
import { Template } from 'meteor/templating'
import { moment } from 'meteor/momentjs:moment'

import StockWatcher from '/client/lib/ethereum/stocks'
import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import { Poll } from '/client/lib/ethereum/contracts'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Voting_New.extend([ClosableSection])

const openPoll = async (description, closingTime) => {
  const addr = Identity.current(true).ethereumAddress
  const poll = await Poll.new(description, { from: addr, gas: 3000000 })
  await poll.setTxid(poll.transactionHash, { from: addr, gas: 120000 })
  return await dispatcher.dispatch(actions.beginPoll, poll.address, +closingTime / 1000)
}

tmpl.onRendered(function () {
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const date = $('[type=date]').val()
      const time = $('[type=time]').val()
      await openPoll(this.$('textarea[name=description]').val(), moment(`${date}, ${time}`))
      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})
