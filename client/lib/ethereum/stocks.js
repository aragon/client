import { Stock } from './contracts'
import Company from './deployed'

class StockWatcher {
  constructor() {
    this.setupCollections()
    this.getAllStocks()
  }

  setupCollections() {
    this.Stock = new Mongo.Collection('stock_collection', { connection: null })
    this.persistentStock = new PersistentMinimongo(this.Stock)
  }

  async getAllStocks() {
    const lastId = await Company.stockIndex.call()
    const addressesPromises = _.range(lastId.valueOf()).map(id => Company.stocks.call(id))
    const stockAddresses = await Promise.all(addressesPromises)
    stockAddresses.forEach(address => {
      this.updateStock(address)
      this.trackStock(address)
    })
  }

  trackStock(address) {
    console.log('Tracking stock at', address)
    Stock.at(address).Transfer({}).watch(() => {
      this.updateStock(address)
    })
  }

  async updateStock(address) {
    const timestamp = Math.floor(+new Date() / 1000)
    const stock = Stock.at(address)
    const stockObject = {
      name: stock.name.call(),
      symbol: stock.symbol.call(),
      votesPerShare: stock.votesPerShare.call().then(x => +x.valueOf()),
      shareholders: stock.shareholderIndex.call().then(x => +x.valueOf()),
      address,
      timestamp,
    }
    const stockInfo = await Promise.allProperties(stockObject)
    console.log(stockInfo)
    this.Stock.upsert(`s_${address}`, stockInfo)
  }
}

export default new StockWatcher()
