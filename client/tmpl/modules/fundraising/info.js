import ClosableSection from '/client/tmpl/components/closableSection'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])
const saleId = () => FlowRouter.current().params.id

tmpl.helpers({
  raise: () => StockSales.findOne({ index: +saleId() }),
})
