import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import { Company } from '/client/lib/ethereum/deployed'
import Identity from '/client/lib/identity'


const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Ownership_Charts'),
  '/issue': () => TemplateVar.set('rightSection', 'Module_Ownership_IssueShares'),
  '/assign': () => TemplateVar.set('rightSection', 'Module_Ownership_AssignShares'),
  '/transfer': () => TemplateVar.set('rightSection', 'Module_Ownership_TransferShares'),
  '/stock/new': () => TemplateVar.set('rightSection', 'Module_Ownership_NewStock'),
  '/shareholder/:address': () => TemplateVar.set('rightSection', 'Module_Ownership_Entity'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onCreated(() => {
  const rightSection = Stocks.find().count() ? 'Module_Ownership_Charts' : 'Module_Ownership_Empty'
  TemplateVar.set('rightSection', rightSection)
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => {
    const addr = $(e.currentTarget).data('shareholder')
    if (addr) {
      FlowRouter.go(`/ownership/shareholder/${addr}`)
    }
  },
})

tmpl.helpers({
  stocks: () => Stocks.find(),
  updated: () => {
    const stock = Stocks.findOne({}, { sort: { updated: -1 } })
    if (stock) return stock.updated
    return {}
  },
  symbol: address => Stocks.findOne({ address }).symbol,
  shareholders: () => {
    let shareholders = []
    Stocks.find().fetch().forEach(s => (shareholders.push(...s.shareholders)))

    /*
    // Commented out as it makes multiple stock types not to show
    shareholders = shareholders.filter(
      (s, index, self) => self.findIndex(t => t.shareholder === s.shareholder) === index)
    */

    return shareholders
  },
  balance: (stock, ethereumAddress) => {
    const entity = Entities.findOne({ ethereumAddress })
    if (!entity || !entity.balances) return -1
    return entity.balances[stock]
  },
  company: () => Company().address,
  entityNameReserves: ReactivePromise(async addr => {
    const entity = await Identity.get(addr)
    if (entity.name === 'Company') entity.name = 'Company reserves'
    return entity.name
  }),
})
