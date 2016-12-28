// @flow

import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { moment } from 'meteor/momentjs:moment'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'
import Company from '/client/lib/ethereum/deployed'
import Identity from '/client/lib/identity'
import { StockSale } from '/client/lib/ethereum/contracts'
import web3 from '/client/lib/ethereum/web3'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])
const reloadSaleId = () => TemplateVar.set('id', +FlowRouter.current().params.id)

const reload = reloadSaleId

const getRaise = () => StockSales.findOne({ index: TemplateVar.get('id') })
const getSaleBalance = sale => web3.eth.getBalance(sale.address).toNumber()

const canTransfer = (sale: Object): Promise<boolean> => (
  StockSale.at(sale.address).isFundsTransferAllowed.call()
           .then((x: boolean): boolean => x && getSaleBalance(sale) > 0)
)

const transfer = async () => {
  await Company.transferSaleFunds(getRaise().index,
    { gas: 2000000, from: Identity.current(true).ethereumAddress })
  reload()
}

tmpl.onRendered(reload)

const raiseTypes: Object = {
  BoundedStandardSale: 'Public fundraise with stable price',
  IndividualInvestorSale: 'Individual investor fundraise',
}

tmpl.helpers({
  raise: getRaise,
  investor: ReactivePromise(async () => {
    const raise = getRaise()
    console.log(raise)
    const entity = await Identity.get(raise.typeMetadata.investorAddress)
    return entity
  }),
  transferrableFunds: getSaleBalance,
  isOpen: sale => moment() <= moment(sale.closeDate),
  isTransferAllowed: ReactivePromise(canTransfer),
  raiseTypeToHuman: (raiseType: string): string => raiseTypes[raiseType],
})

tmpl.events({
  'reload #raise': reload,
  'click #transfer': transfer,
})
