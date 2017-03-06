// @flow
import { _ } from 'meteor/underscore'
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import { Stock } from './contracts'
import Company from './deployed'

import Watcher from './watcher'

Stocks = new Mongo.Collection('stocks', { connection: null })

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
      this.watchEvent(Stock.at(stock.address).Transfer, (err, ev) => {
        this.saveStockTransfer(stock.index, stock.address, ev.args.from, ev.args.to, ev.args.value.toNumber())
      })
    })
  }

  saveStockTransfer(stock, stockAddress, from, to, value) {
    // this.updateBalance(stockAddress, from, -value, true)
    // this.updateBalance(stockAddress, to, value, true)

    // this could be deleted, if all updates correctly and in order and only once
    this.setBalance(from, stockAddress)
    this.setBalance(to, stockAddress)
  }

  async setBalance(holder, stockAddress) {
    const balance = await Stock.at(stockAddress).balanceOf(holder)
    this.updateBalance(stockAddress, holder, balance.toNumber())
  }

  updateBalance(stockAddress, ethereumAddress, balance, isIncrement = false) {
    const predicate = { ethereumAddress }
    const currentEntity = Entities.findOne(predicate)
    let balances = {}
    if (currentEntity && currentEntity.balances) {
      balances = currentEntity.balances
    }

    if (isIncrement) {
      balances[stockAddress] = (balances[stockAddress] || 0) + balance
    } else {
      balances[stockAddress] = balance
    }

    Entities.upsert(predicate, { $set: { balances } })
    const update = { $addToSet: { shareholders: { $each: [ { shareholder: ethereumAddress, stock: { address: stockAddress }} ]}}, $set: { updated: new Date() } }
    this.Stocks.upsert({ address: stockAddress }, update)
  }

  async getStock(address: string, index: number) {
    this.trackStock(address, index)
    await this.updateStock(address, index)
  }

  allShareholdersForStock(s, shareholderIndex) {
    if (!s.address) return []
    const stock = Stock.at(s.address)
    const symbol = stock.symbol()
    const convert = shareholder => ({ shareholder, stock: { address: s.address } })
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

    const predicate = { _id: `s_${address}` }
    this.Stocks.upsert(predicate, stockInfo)

    stockInfo.shareholders.forEach(({ shareholder }, i) => {
      const entity = Entities.findOne({ ethereumAddress: shareholder })
      if (i === 0 || !entity || !entity.balances || !entity.balances[stockInfo.address]) {
        this.setBalance(shareholder, stockInfo.address)
      }
    })
  }
}

export default new StockWatcher()
