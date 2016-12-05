import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

Template.module_ownership.created = () => {
  TemplateVar.set('rightSection', 'module_ownershipEmpty')
}

Template.module_ownership.events({
  'click button#issueShares': () => TemplateVar.set('rightSection', 'module_ownershipIssueShares'),
  'click button#assignShares': () => TemplateVar.set('rightSection', 'module_ownershipAssignShares'),
  'click table tr': () => TemplateVar.set('rightSection', 'module_entity'),
})

Template.module_ownership.helpers({
  stocks: () => Stocks.find(),
  rightSection: () => TemplateVar.get('rightSection'),
  context: () => ({ parent: Template.instance() }),
  allShareholders: ReactivePromise(async (s) => {
    const stock = Stock.at(s.address)
    const convert = shareholder => ({ shareholder, stock: s })
    const shareholders = _.range(s.shareholders)
                          .map(i => stock.shareholders.call(i).then(convert))
    return Promise.all(shareholders)
  }),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
  company: () => (Company.address),
})
