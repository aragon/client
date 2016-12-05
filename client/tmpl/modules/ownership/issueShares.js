import ClosableSection from '/client/tmpl/elements/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks
const tmpl = Template.module_ownershipIssueShares

ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')

tmpl.helpers({
  stocks: () => Stocks.find(),
})

issueStock = (kind, value) => (
  Company.issueStock(kind, value, { from: EthAccounts.findOne().address })
)

tmpl.rendered = () => {
  const parentTmplIns = Template.instance().data.parent
  const dimmer = this.$('.dimmer')

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()

      await issueStock($('input[name=kind]').val(), $('input[name=number]').val())

      TemplateVar.setTo(dimmer, 'state', 'loading')
      setTimeout(() => {
        TemplateVar.setTo(dimmer, 'state', 'success')
        setTimeout(() => (TemplateVar.set(parentTmplIns, 'rightSection', 'module_ownershipEmpty')), 2500)
      }, 500)
      return false
    },
  })
}
