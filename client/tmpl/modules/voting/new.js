import StockWatcher from '/client/lib/ethereum/stocks'
const Stocks = StockWatcher.Stocks
import ClosableSection from '/client/tmpl/components/closableSection'
import Company from '/client/lib/ethereum/deployed'
import { Poll } from '/client/lib/ethereum/contracts'

const tmpl = Template.Module_Voting_New.extend([ClosableSection])

const openPoll = async (description, closingTime) => {
  const addr = EthAccounts.findOne().address
  const poll = await Poll.new(description, 50, { from: addr, gas: 1000000 })
  await poll.setTxid(poll.transactionHash, { from: addr, gas: 120000 })
  return await Company.beginPoll(poll.address, +closingTime / 1000, { from: addr, gas: 120000 * Stocks.find().count() })
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
