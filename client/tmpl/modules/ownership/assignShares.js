import Keybase from '/client/lib/keybase'
import ClosableSection from '/client/tmpl/elements/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.module_ownershipAssignShares
ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')

const assignStock = (kind, value, recipient) => {
  console.log('assigning', kind, value, recipient)
  return Company.grantStock(+kind, +value, recipient,
    { from: EthAccounts.findOne().address, gas: 150000 })
}

tmpl.rendered = () => {
  const dimmer = this.$('.dimmer')

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()

      await assignStock($('input[name=kind]').val(), $('input[name=number]').val(), $('input[name=addr]').val())

      TemplateVar.setTo(dimmer, 'state', 'success')
      return false
    },
  })
}

tmpl.helpers({
  selectedReceiver: () => (TemplateVar.getFrom('#el_keybase', 'user')),
  addressForUser: ReactivePromise(Keybase.getEthereumAddress),
  stocks: () => Stocks.find(),
  onSuccess: () => {
    const parentTmplIns = Template.instance().data.parent
    return () => {
      TemplateVar.set(parentTmplIns, 'rightSection', 'module_ownershipEmpty')
    }
  },
})
