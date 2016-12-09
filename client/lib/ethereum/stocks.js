import { Stock } from './contracts'
import Company from './deployed'

const Stocks = new Mongo.Collection('stock_collection', { connection: null })

class StockWatcher {
  constructor() {
    this.setupCollections()
    this.getAllStocks()
    this.listenForNewStock()
  }

  setupCollections() {
    this.Stocks = Stocks
    this.persistentStock = new PersistentMinimongo(this.Stocks)
  }

  listenForNewStock() {
    Company.IssuedStock({}).watch((err, ev) =>
      this.getStock(ev.args.stockAddress, ev.args.stockIndex.toNumber()))
  }

  async getAllStocks() {
    const lastId = await Company.stockIndex.call().then(x => x.valueOf())
    const addressesPromises = _.range(lastId).map(id => Company.stocks.call(id))
    const stockAddresses = await Promise.all(addressesPromises)

    await Promise.all(stockAddresses.map((a, i) => this.getStock(a, i)))

    this.Stocks.remove({ address: { $nin: stockAddresses } })
  }

  async getStock(address, index) {
    this.trackStock(address, index)
    await this.updateStock(address, index)
  }

  async allShareholders(stocks) {
    if (!stocks) {
      stocks = Stocks.find({}).fetch()
    }

    const promises = stocks.map((s) => {
      if (!s.address) return []
      const stock = Stock.at(s.address)
      const convert = shareholder => ({ shareholder, stock: s })
      const shareholders = _.range(s.shareholders)
                            .map(i => stock.shareholders.call(i).then(convert))
      return Promise.all(shareholders)
    })

    return await Promise.all(promises)
  }

  trackStock(address, index) {
    Stock.at(address).Transfer({}).watch(() => {
      this.updateStock(address, index)
    })
  }

  async updateStock(address, index) {
    const stock = Stock.at(address)
    const stockObject = {
      name: stock.name.call(),
      symbol: stock.symbol.call(),
      votesPerShare: stock.votesPerShare.call().then(x => x.toNumber()),
      shareholders: stock.shareholderIndex.call().then(x => x.toNumber()),
      totalSupply: stock.totalSupply.call().then(x => x.toNumber()),
      address,
      index,
    }
    const stockInfo = await Promise.allProperties(stockObject)
    this.Stocks.upsert(`s_${address}`, stockInfo)
  }
}

export default new StockWatcher()
