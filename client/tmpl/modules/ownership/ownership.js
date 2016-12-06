import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

Template.module_ownership.created = () => {
  TemplateVar.set('rightSection', 'module_ownershipCharts')
}

Template.module_ownership.events({
  'click button#issueShares': () => TemplateVar.set('rightSection', 'module_ownershipIssueShares'),
  'click button#assignShares': () => TemplateVar.set('rightSection', 'module_ownershipAssignShares'),
  'click table tr': (e) => {
    const shareholder = $(e.currentTarget).data('shareholder')
    if (shareholder) {
      TemplateVar.set('rightSection', 'module_entity')
      TemplateVar.set('selectedShareholder', $(e.currentTarget).data('shareholder'))
    }
  },
})

Template.module_ownership.helpers({
  stocks: () => Stocks.find(),
  rightSection: () => TemplateVar.get('rightSection'),
  context: () => ({ parent: Template.instance() }),
  allShareholders: ReactivePromise(StockWatcher.allShareholders, [{ address: 'loading...' }], []),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
  company: () => (Company.address),
})
