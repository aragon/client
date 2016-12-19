import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'
import helpers from '/client/helpers'

const timeRange = helpers.timeRange
const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Fundraising_New_Individual.extend([ClosableSection])

tmpl.onRendered(function () {
  TemplateVar.set('selectedStock', -1)

  const self = this
  this.$('.dropdown').dropdown({
    onChange: (v) => TemplateVar.set(self, 'selectedStock', +v),
  })
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()

      const selectedStock = TemplateVar.get(self, 'selectedStock')
      const amount = $('input[name=number]').val()
      const recipient = $('input[name=addr]').val()

      if (TemplateVar.get(self, 'assignMode')) {
        await assignStock(selectedStock, amount, recipient)
      } else {
        const cliff = $('input[name=cliff]').val()
        const vesting = $('input[name=vesting]').val()

        await createStockGrant(selectedStock, amount, recipient, cliff, vesting)
      }

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  selectedRecipient: () => (TemplateVar.get('recipient')),
  entity: ReactivePromise(Identity.get),
  stocks: () => Stocks.find(),
  defaultAddress: () => EthAccounts.findOne().address,
  availableShares: ReactivePromise((selectedStock) => {
    const stock = Stocks.findOne({ index: +selectedStock })
    if (!stock) { return Promise.reject() }
    return Stock.at(stock.address).balanceOf(Company.address).then(x => x.valueOf())
  }, '', '0'),
})

tmpl.events({
  'select .keybaseEl': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/fundraising'),
})
