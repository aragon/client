import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_IssueShares.extend([ClosableSection])

const issueStock = (kind, value) => (
  Company.issueStock(kind, value, { from: EthAccounts.findOne().address })
)

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
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
