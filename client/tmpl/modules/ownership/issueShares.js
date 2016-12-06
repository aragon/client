import ClosableSection from '/client/tmpl/elements/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks
const tmpl = Template.module_ownershipIssueShares

window.Stocks = Stocks

ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipCharts')

tmpl.helpers({
  stocks: () => Stocks.find(),
  onSuccess: () => {
    const parentTmplIns = Template.instance().data.parent
    return () => {
      TemplateVar.set(parentTmplIns, 'rightSection', 'module_ownershipCharts')
    }
  },
})

const issueStock = (kind, value) => (
  Company.issueStock(kind, value, { from: EthAccounts.findOne().address })
)

tmpl.rendered = () => {
  const dimmer = this.$('.dimmer')

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      await issueStock(this.$('input[name=kind]').val(), this.$('input[name=number]').val())
      TemplateVar.setTo(dimmer, 'state', 'success')
      return false
    },
  })
}
