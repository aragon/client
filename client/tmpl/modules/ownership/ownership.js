import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership.extend()

tmpl.created = () => {
  const rightSection = Stocks.find().count() ? 'Module_Ownership_Charts' : 'Module_Ownership_Empty'
  TemplateVar.set('rightSection', rightSection)
}

tmpl.rendered = () => {
  this.$('table').tablesort()
}

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click button#issueShares': () => TemplateVar.set('rightSection', 'Module_Ownership_IssueShares'),
  'click button#assignShares': () => TemplateVar.set('rightSection', 'Module_Ownership_AssignShares'),
  'click table tr': (e) => {
    const shareholder = $(e.currentTarget).data('shareholder')
    if (shareholder) {
      TemplateVar.set('rightSection', 'module_entity')
      TemplateVar.set('selectedShareholder', $(e.currentTarget).data('shareholder'))
    }
  },
  'success #issueShares, success #assignShares, closed div': (e, instance) => (
    TemplateVar.set(instance, 'rightSection', 'Module_Ownership_Charts')
  ),
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  shareholders: ReactivePromise(() => (
    StockWatcher.allShareholders().then(x => [].concat(...x))
  )),
  balance: ReactivePromise((stock, shareholder) => (
    Stock.at(stock).balanceOf(shareholder).then(x => x.valueOf())
  )),
  company: () => (Company.address),
})
