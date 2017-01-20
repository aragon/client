import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Roles.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Roles_Empty'),
  '/assign': () => TemplateVar.set('rightSection', 'Module_Roles_Assign'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onCreated(() => {
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/roles/entity/${$(e.currentTarget).data('entity')}`),
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  updated: () => {
    const stock = Stocks.findOne({}, { sort: { updated: -1 } })
    if (stock) return stock.updated
    return {}
  },
  shareholders: ReactivePromise(() => (
    StockWatcher.allShareholders().then(x => [].concat(...x))
  )),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
  company: () => Company.address,
})
