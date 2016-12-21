import ClosableSection from '/client/tmpl/components/closableSection'
import Keybase from '/client/lib/identity/keybase'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock, GrantVestedStockVoting } from '/client/lib/ethereum/contracts'
import helpers from '/client/helpers'

const timeRange = helpers.timeRange
const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_AssignShares.extend([ClosableSection])

const assignStock = (kind, value, recipient) => (
  Company.grantStock(+kind, +value, recipient,
    { from: EthAccounts.findOne().address, gas: 150000 })
)

const createStockGrant = async (kind, value, recipient, cliff, vesting) => {
  const supportNeeded = 50
  const now = new Date()

  const description = `Grant ${value} ${Stocks.findOne({ index: +kind }).symbol} shares to ${recipient} with ${timeRange(now, cliff)} cliff and ${timeRange(now, vesting)} vesting`
  const addr = EthAccounts.findOne().address
  const oneWeekFromNow = +moment().add(7, 'days') / 1000

  const voting = await GrantVestedStockVoting.new(
                  kind, value, recipient,
                  +moment(cliff) / 1000, +moment(vesting) / 1000,
                  supportNeeded, description,
                  { from: addr, gas: 1500000 })
  await voting.setTxid(voting.transactionHash, { from: addr, gas: 150000 })
  return await Company.beginPoll(voting.address, oneWeekFromNow,
                { from: addr, gas: 120000 * Stocks.find().count() })
}

tmpl.onRendered(function () {
  TemplateVar.set('assignMode', true)
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
      console.log(TemplateVar.get(self, 'recipient'))
      const recipient = TemplateVar.get(self, 'recipient').ethereumAddress

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
  addressForUser: ReactivePromise(Keybase.getEthereumAddress),
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
  'success .dimmer': () => FlowRouter.go('/ownership'),
  'click .ui.menu.mode a': (e) => TemplateVar.set('assignMode', $(e.currentTarget).data('issue')),
})
