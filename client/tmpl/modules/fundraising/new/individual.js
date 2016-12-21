import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import StockSaleWatcher from '/client/lib/ethereum/stocksales'
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

      const title = $('input[name=title]').val()
      const selectedStock = TemplateVar.get(self, 'selectedStock')
      const investor = TemplateVar.get(self, 'recipient').ethereumAddress
      console.log(investor)
      const price = web3.toWei($('input[name=price]').val(), 'ether')

      const units = $('input[name=units]').val()
      const closes = +moment($('[type=date]').val()) / 1000

      const address = EthAccounts.findOne().address

      console.log('creating with investor', investor)
      await StockSaleWatcher.createIndividualInvestorVote(address, selectedStock, investor, price, units, closes, title)

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
