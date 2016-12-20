import Company from './deployed'
import { StockSale, BoundedStandardSaleVoting, IndividualInvestorSaleVoting } from './contracts'

import StockWatcher from './stocks'

const Stocks = StockWatcher.Stocks

class StockSalesWatcher {
  constructor() {
    this.setupCollections()
    this.listenForNewSales()
    this.getNewSales()
  }

  setupCollections() {
    this.StockSales = new Mongo.Collection('sales', { connection: null })
    this.persistentStockSales = new PersistentMinimongo(this.StockSales)
  }

  listenForNewSales() {
    Company.NewStockSale({}).watch((err, ev) => {
      this.getSale(ev.args.saleAddress, ev.args.saleIndex.toNumber())
    })
  }

  async getNewSales() {
    const lastSavedIndex = (this.StockSales.findOne({}, { sort: { index: -1 } }) || { index: 0 }).index
    const lastCompanyIndex = Company.saleIndex.call().then(x => x.toNumber())
    if (lastSavedIndex > lastCompanyIndex) { this.StockSales.remove({}) }
    if (lastSavedIndex < lastCompanyIndex) {
      const allNewSales = _.range(lastSavedIndex + 1, lastCompanyIndex)
                            .map(i => Company.sales.call(i))
                            .map((a, i) => this.getSale(a, i))
      await Promise.all(allNewSales)
    }
  }

  async getSale(address, index) {
    const sale = StockSale.at(address)
    const saleObject = {
      stock: sale.stockId.call().then(x => x.toNumber()),
      closeDate: sale.closeDate.call().then(x => new Date(x.toNumber() * 1000)),
      raisedAmount: sale.raisedAmount.call().then(x => x.toNumber()),
      title: sale.saleTitle.call(),
      type: sale.saleType.call(),
      index,
      address,
    }

    this.StockSales.upsert(`ss_${address}`, await Promise.allProperties(saleObject))
  }

  async createIndividualInvestorVote(address, stock, investor, price, units, closes, title = 'Series Y') {
    const description = `${web3.fromWei(price * units, 'ether')}ETH raise from ${address}`
    const saleVote = await IndividualInvestorSaleVoting.new(stock, investor, units, price, closes, 50, description, title,
                          { from: address, gas: 2000000 })
    return await this.submitSaleVote(saleVote, address)
  }

  async createBoundedSaleVote(address, stock, min, max, price, closes, title = 'Series Z') {
    const description = `Raise of max ${max} shares @ ${web3.fromWei(price, 'ether')}ETH`
    const saleVote = await BoundedStandardSaleVoting.new(stock, min, max, price, closes, 50, description, title,
                           { from: address, gas: 2000000 })
    return await this.submitSaleVote(saleVote, address)
  }

  async submitSaleVote(saleVote, address) {
    const oneWeekFromNow = +moment().add(7, 'days') / 1000
    await saleVote.setTxid(saleVote.transactionHash, { from: address, gas: 120000 })
    return await Company.beginPoll(saleVote.address, oneWeekFromNow,
          { from: address, gas: 120000 * Stocks.find().count() })
  }
}

_StockSalesWatcher = new StockSalesWatcher()

export default _StockSalesWatcher
