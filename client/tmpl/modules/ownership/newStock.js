// @flow
import { Template } from 'meteor/templating'
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'

import ClosableSection from '/client/tmpl/components/closableSection'
import StockWatcher from '/client/lib/ethereum/stocks'
import { Company } from '/client/lib/ethereum/deployed'
import { CustomStock, WrappedCustomStock } from '/client/lib/ethereum/contracts'
import Tokens from '/client/lib/ethereum/tokens'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_NewStock.extend([ClosableSection])

const tokenDetails = new ReactiveVar()

const deployCustomStock = async (name, symbol, votingPower, economicRights, initialSupply) => {
  const deployTx = await dispatcher.deployContract(CustomStock, Company().address,
                          name, symbol, votingPower, economicRights)
  return await watchStockDeployment(deployTx, initialSupply)
}

const deployWrappedStock = async (token, name, symbol, votingPower, economicRights) => {
  const deployTx = await dispatcher.deployContract(WrappedCustomStock, Company().address,
                          token, name, symbol, votingPower, economicRights)
  return await watchStockDeployment(deployTx, 0)
}

const watchStockDeployment = async (txId, initialSupply) => {
  return new Promise((resolve, reject) => {
    TxQueue.addListener(txId, () => {
      web3.eth.getTransactionReceipt(txId, (err, tx) => {
        if (err) return reject(err)
        if (!tx.contractAddress) return reject('error deploying stock', tx)
        resolve(submitStock(tx.contractAddress, initialSupply))
      })
    })
  })
}

const submitStock = (stockAddress, initialSupply) => {
  return dispatcher.dispatch(actions.addStock, stockAddress, initialSupply)
}

tmpl.onRendered(function () {
  $('.tooltip').popup()
  TemplateVar.set('existingToken', false)
  tokenDetails.set(null)

  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const name = this.$('input[name=name]').val()
      const symbol = this.$('input[name=symbol]').val()
      const votingPower = this.$('input[name=votingPower]').val()
      const economicRights = this.$('input[name=economicRights]').val()

      if (!TemplateVar.get(this, 'existingToken')) {
        const initialSupply = this.$('input[name=initialSupply]').val()
        await deployCustomStock(name, symbol, votingPower, economicRights, initialSupply)
      } else {
        const token = TemplateVar.get(this, 'parentToken')
        await deployWrappedStock(token, name, symbol, votingPower, economicRights)
      }

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

const stockTemplates = [
  { name: 'Voting Stock', symbol: 'ARN-a', votingPower: 1, economicRights: 1 },
  { name: 'Non-voting Stock', symbol: 'ARN-b', votingPower: 0, economicRights: 1 },
  { name: 'Founders Stock', symbol: 'ARN-c', votingPower: 5, economicRights: 1 },
  { name: 'Unicorn Stock', symbol: 'ARN-🦄', votingPower: 10, economicRights: 10 },
]

tmpl.helpers({
  actionName: () => 'addStock',
  stockTemplates: () => stockTemplates,
  tokenDetails: () => tokenDetails.get(),
  isCompanyStock: () => {
    const tokenAddress = TemplateVar.get(this, 'parentToken')
    Stocks.findOne({ $or: [{ ethereumAddress: tokenAddress }, { 'parentToken.ethereumAddress': tokenAddress }] })
  },
})

tmpl.events({
  'select .identityAutocomplete': async (e, instance, user) => {
    tokenDetails.set(null)
    TemplateVar.set('parentToken', user.ethereumAddress)
    tokenDetails.set(await Tokens.getTokenProperties(user.ethereumAddress))
  },
  'success .dimmer': () => FlowRouter.go('/ownership'),
  'click #existingTokenToggle': () => TemplateVar.set('existingToken', !TemplateVar.get('existingToken')),
  'click .stock-template': e => {
    const selectedSymbol = $(e.currentTarget).data('stock')
    const selectedTemplate = stockTemplates.filter(s => s.symbol === selectedSymbol)[0]
    TemplateVar.set('existingToken', false)
    this.$('input[name=name]').val(selectedTemplate.name)
    this.$('input[name=symbol]').val(selectedTemplate.symbol)
    this.$('input[name=initialSupply]').val(1000)
    this.$('input[name=votingPower]').val(selectedTemplate.votingPower)
    this.$('input[name=economicRights]').val(selectedTemplate.economicRights)
  }
})
