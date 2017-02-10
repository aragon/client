// @flow
import { _ } from 'meteor/underscore'
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import { Stock } from './contracts'
import Company from './deployed'

import Watcher from './watcher'

const Stocks = new Mongo.Collection('stocks', { connection: null })

class StockWatcher extends Watcher {
  Stocks: Mongo.Collection
  persistentStock: PersistentMinimongo

  constructor() {
    super('s')
    this.setupCollections()
  }

  listen() {
    this.listenForNewStock()
    this.listenForStockTransfers()
  }

  setupCollections() {
    this.Stocks = Stocks
    this.persistentStock = new PersistentMinimongo(this.Stocks)
  }

  listenForNewStock() {
    this.watchEvent(Company().IssuedStock, this.watchStock)
  }

  watchStock(err, ev) {
    if (!err) this.getStock(ev.args.stockAddress, ev.args.stockIndex.toNumber())
  }

  listenForStockTransfers(stocks = this.Stocks.find().fetch()) {
    stocks.forEach(stock => {
      this.watchEvent(Stock.at(stock.address).Transfer, () => this.getStock(stock.address, stock.index)) // todo: save balances
    })
  }

  async getStock(address: string, index: number) {
    this.trackStock(address, index)
    await this.updateStock(address, index)
  }

  allShareholdersForStock(s, shareholderIndex) {
    if (!s.address) return []
    const stock = Stock.at(s.address)
    const convert = shareholder => ({ shareholder, stock: s })
    const shareholders = _.range(shareholderIndex)
                          .map(i => stock.shareholders.call(i).then(convert))
    return Promise.all(shareholders)
  }

  trackStock(address: string, index: number) {
    Stock.at(address).Transfer({}).watch(() => {
      this.updateStock(address, index)
    })
  }

  async updateStock(address: string, index: number) {
    const stock = Stock.at(address)
    const stockObject = {
      name: stock.name.call(),
      symbol: stock.symbol.call(),
      votesPerShare: stock.votesPerShare.call().then(x => x.toNumber()),
      shareholders: this.allShareholdersForStock(stock, await stock.shareholderIndex.call().then(x => x.toNumber())),
      totalSupply: stock.totalSupply.call().then(x => x.toNumber()),
      updated: new Date(),
      address,
      index,
    }
    const stockInfo = await Promise.allProperties(stockObject)
    console.log('upserting')
    this.Stocks.upsert({ _id: `s_${address}` }, stockInfo)
  }
}

export default new StockWatcher()
