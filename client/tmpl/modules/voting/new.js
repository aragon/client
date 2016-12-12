import ClosableSection from '/client/tmpl/components/closableSection'
import Company from '/client/lib/ethereum/deployed'
import { Poll } from '/client/lib/ethereum/contracts'

const tmpl = Template.Module_Voting_New.extend([ClosableSection])

const openPoll = async (description, closingTime) => {
  const addr = EthAccounts.findOne().address
  const poll = await Poll.new(description, 50, { from: addr, gas: 1000000 })
  return await Company.beginPoll(poll.address, +closingTime, { from: addr, gas: 100000 })
}

tmpl.onRendered(function () {
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      const date = $('[type=date]').val()
      const time = $('[type=time]').val()
      await openPoll(this.$('textarea[name=description]').val(), moment(`${date}, ${time}`))
      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})
