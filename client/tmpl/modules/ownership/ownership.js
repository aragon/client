import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.module_ownership.extend()

tmpl.created = () => {
  TemplateVar.set('rightSection', 'module_ownershipCharts')
}

tmpl.events({
  'click button#issueShares': () => TemplateVar.set('rightSection', 'module_ownershipIssueShares'),
  'click button#assignShares': () => TemplateVar.set('rightSection', 'module_ownershipAssignShares'),
  'click table tr': (e) => {
    const shareholder = $(e.currentTarget).data('shareholder')
    if (shareholder) {
      TemplateVar.set('rightSection', 'module_entity')
      TemplateVar.set('selectedShareholder', $(e.currentTarget).data('shareholder'))
    }
  },
  'success #issueShares, success #assignShares, closed div': (e, instance) => {
    TemplateVar.set(instance, 'rightSection', 'module_ownershipCharts')
  },
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  rightSection: () => TemplateVar.get('rightSection'),
  allShareholders: ReactivePromise(StockWatcher.allShareholders, [{ address: 'loading...' }], []),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
  company: () => (Company.address),
})
