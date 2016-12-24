import ClosableSection from '/client/tmpl/components/closableSection'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'
import Identity from '/client/lib/identity'
import { StockSale } from '/client/lib/ethereum/contracts'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])
const reloadSaleId = () => TemplateVar.set('id', +FlowRouter.current().params.id)

const reload = reloadSaleId

const getRaise = () => StockSales.findOne({ index: TemplateVar.get('id') })
const getSaleBalance = sale => web3.eth.getBalance(sale.address).toNumber()

const canTransfer = sale => (
  StockSale.at(sale.address).isFundsTransferAllowed.call()
           .then(x => x && getSaleBalance(sale) > 0)
)

const transfer = async () => {
  await StockSale.at(getRaise().address).transferFunds({ gas: 2000000, from: Identity.current(true).ethereumAddress })
  reload()
}

tmpl.onRendered(reload)

tmpl.helpers({
  raise: getRaise,
  transferrableFunds: getSaleBalance,
  isOpen: sale => moment() <= moment(sale.closeDate),
  isTransferAllowed: ReactivePromise(canTransfer),
})

tmpl.events({
  'reload #raise': reload,
  'click #transfer': transfer,
})
