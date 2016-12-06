import ClosableSection from '/client/tmpl/components/closableSection'
import Keybase from '/client/lib/keybase'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_AssignShares.extend([ClosableSection])

const assignStock = (kind, value, recipient) => (
  Company.grantStock(+kind, +value, recipient,
    { from: EthAccounts.findOne().address, gas: 150000 })
)

tmpl.rendered = () => {
  const dimmer = this.$('.dimmer')

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      await assignStock($('input[name=kind]').val(), $('input[name=number]').val(), $('input[name=addr]').val())
      dimmer.trigger('finished', { state: 'success' })
      return false
    },
  })
}

tmpl.helpers({
  selectedReceiver: () => (TemplateVar.getFrom('#Element_KeybaseAutocomplete', 'user')),
  addressForUser: ReactivePromise(Keybase.getEthereumAddress),
  stocks: () => Stocks.find(),
})

tmpl.events({
  'success .dimmer': (e, instance) =>
    (instance.$('#assignShares').trigger('success')),
})
