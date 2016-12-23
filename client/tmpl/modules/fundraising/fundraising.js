import StockSalesWatcher from '/client/lib/ethereum/stocksales'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Fundraising_Empty'),
  '/new': () => TemplateVar.set('rightSection', 'Module_Fundraising_New'),
  '/new/individual': () => TemplateVar.set('rightSection', 'Module_Fundraising_New_Individual'),
  '/new/bounded': () => TemplateVar.set('rightSection', 'Module_Fundraising_New_Bounded'),
  '/:id': () => {
    TemplateVar.set('rightSection', 'Module_Fundraising_Info')
    setTimeout(() => $('#raise').trigger('reload'), 10)
  },
})

tmpl.onCreated(() => {
  TemplateVar.set('rightSection', 'Module_Fundraising_Empty')
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/fundraising/${$(e.currentTarget).data('id')}`),
})

tmpl.helpers({
  raises: () => StockSales.find(),
})
