import ClosableSection from '/client/tmpl/components/closableSection'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])
const reloadSaleId = () => TemplateVar.set('id', +FlowRouter.current().params.id)

const reload = () => {
  reloadSaleId()
}

tmpl.onRendered(function () {
  reload()
})

tmpl.helpers({
  raise: () => StockSales.findOne({ index: TemplateVar.get('id') }),
  isOpen: sale => moment() <= moment(sale.closeDate),
})

tmpl.events({
  'reload #raise': reload,
})
