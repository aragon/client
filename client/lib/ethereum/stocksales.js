import Company from './deployed'
import { StockSale, StockSaleVoting } from './contracts'

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
      this.getSale(ev.args.saleAddress, ev.args.saleIndex)
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
      min: sale.minUnits.call().then(x => x.toNumber()),
      cap: sale.maxUnits.call().then(x => x.toNumber()),
      stock: sale.stockId.call().then(x => x.toNumber()),
      price: sale.getBuyingPrice.call(10).then(x => x.toNumber()),
      closeDate: sale.closeDate.call().then(x => new Date(x.toNumber() * 1000)),
      index,
      address,
    }

    this.StockSales.upsert(`ss_${address}`, await Promise.allProperties(saleObject))
  }

  async createSaleVote(address, stock, min, max, price, closes) {
    const oneWeekFromNow = +moment().add(7, 'days') / 1000
    const description = `Stock sale with max ${max} shares @ ${web3.fromWei(price, 'ether')}ETH`
    const saleVote = await StockSaleVoting.new(stock, min, max, price, closes, 50, description,
                           { from: address, gas: 2000000 })
    await saleVote.setTxid(saleVote.transactionHash, { from: address, gas: 120000 })
    return await Company.beginPoll(saleVote.address, oneWeekFromNow,
          { from: address, gas: 120000 * Stocks.find().count() })
  }
}

_StockSalesWatcher = new StockSalesWatcher()

export default _StockSalesWatcher
