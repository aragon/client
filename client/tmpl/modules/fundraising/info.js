// @flow

import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { moment } from 'meteor/momentjs:moment'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'
import Identity from '/client/lib/identity'
import { StockSale } from '/client/lib/ethereum/contracts'

import { dispatcher, actions } from '/client/lib/action-dispatcher'

const StockSales = StockSalesWatcher.StockSales

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])
const reloadSaleId = () => (TemplateVar.set('id', +FlowRouter.current().params.id))

const getRaise = () => StockSales.findOne({ index: TemplateVar.get('id') })
const getBalance = address => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (err, balance) => {
      if (err) return reject(err)
      resolve(balance.toNumber())
    })
  })
}

const canTransfer = async (sale: Object): Promise<boolean> => {
  const allowed = await StockSale.at(sale.address).isFundsTransferAllowed()
  const balance = await getBalance(sale.address)
  return allowed && balance > 0
}

const transfer = async () => {
  this.$('.dimmer').trigger('loading')

  // await dispatcher.dispatch(actions.transferSaleFunds, getRaise().index)
  reloadSaleId()

  this.$('.dimmer').trigger('finished', { state: 'success' })
}

tmpl.onRendered(reloadSaleId)

const raiseTypes: Object = {
  BoundedStandardSale: 'Public fundraise with stable price',
  IndividualInvestorSale: 'Individual investor fundraise',
}

tmpl.helpers({
  raise: getRaise,
  investor: ReactivePromise(async () => {
    const raise = getRaise()
    const entity = await Identity.get(raise.typeMetadata.investorAddress)
    return entity
  }),
  transferrableFunds: ReactivePromise(getBalance),
  isOpen: sale => moment() <= moment(sale.closeDate),
  isTransferAllowed: ReactivePromise(canTransfer),
  raiseTypeToHuman: (raiseType: string): string => raiseTypes[raiseType],
})

tmpl.events({
  'reload #raise': () => reloadSaleId(),
  'click button': () => {
    transfer()
  },
})
