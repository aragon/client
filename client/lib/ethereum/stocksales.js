import Company from './deployed'
import { StockSale, StockSaleVoting, IndividualInvestorSale, BoundedStandardSale } from './contracts'

import StockWatcher from './stocks'

const Stocks = StockWatcher.Stocks

class StockSalesWatcher {
  constructor() {
    this.setupCollections()
    this.listenForNewSales()
    this.getNewSales()
    this.listenForSalesEvents()
  }

  setupCollections() {
    this.StockSales = new Mongo.Collection('sales', { connection: null })
    this.persistentStockSales = new PersistentMinimongo(this.StockSales)
  }

  listenForNewSales() {
    Company.NewStockSale({}).watch(async (err, ev) => {
      const newsale = await this.getSale(ev.args.saleAddress, ev.args.saleIndex.toNumber())
      this.listenForSalesEvents([newsale])
    })
  }

  listenForSalesEvents(sales = this.StockSales.find().fetch()) {
    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    const update = sale => ((err, a) => {
      if (a.length === 0) { return } // Discard empty get arrays
      const ev = a[a.length - 1] || a
      this.lastWatchedBlock = ev.blockNumber
      this.getSale(sale.address, sale.index)
    })

    sales.forEach(sale => {
      const stockSale = StockSale.at(sale.address)
      stockSale.StockSold({}, streamingPredicate).watch(update(sale))
      stockSale.StockBought({}, streamingPredicate).watch(update(sale))
      stockSale.StockSold({}, missedPredicate).get(update(sale))
      stockSale.StockBought({}, missedPredicate).get(update(sale))
    })
  }

  async getNewSales() {
    const lastSavedIndex = (this.StockSales.findOne({}, { sort: { index: -1 } }) || { index: 0 }).index
    const lastCompanyIndex = await Company.saleIndex.call().then(x => x.toNumber())
    if (lastSavedIndex > lastCompanyIndex || lastCompanyIndex === 1) {
      this.StockSales.remove({})
    }
    if (lastSavedIndex < lastCompanyIndex) {
      const baseIndex = lastSavedIndex + 1
      const allNewSalesAddresses = await Promise.all(
                          _.range(baseIndex, lastCompanyIndex)
                            .map(i => Company.sales.call(i))
                          )
      const newSales = await Promise.all(allNewSalesAddresses.map((a, i) => this.getSale(a, baseIndex + i)))

      console.log('fetched', newSales)
      this.listenForSalesEvents(newSales)
    }
  }

  async getSale(address, index) {
    const sale = StockSale.at(address)
    const investorAddresses = _.range(0, await sale.investorIndex.call())
                                .map(i => sale.investors.call(i))

    const saleObject = {
      stock: sale.stockId.call().then(x => x.toNumber()),
      closeDate: sale.closeDate.call().then(x => new Date(x.toNumber() * 1000)),
      raisedAmount: sale.raisedAmount.call().then(x => x.toNumber()),
      title: sale.saleTitle.call(),
      type: sale.saleType.call(),
      raiseTarget: sale.raiseTarget.call().then(x => x.toNumber()),
      raiseMaximum: sale.raiseMaximum.call().then(x => x.toNumber()),
      investors: Promise.all(investorAddresses).then(x => [...new Set(x)]), // unique elements in array
      index,
      address,
    }

    const finalSale = await Promise.allProperties(saleObject)
    this.StockSales.upsert(`ss_${address}`, finalSale)
    return finalSale
  }

  async createIndividualInvestorVote(address, stock, investor, price, units, closes, title = 'Series Y') {
    const sale = await IndividualInvestorSale.new(
                            Company.address, stock, investor, units, price, closes, title,
                            { from: address, gas: 2000000 })
    return await this.submitSale(sale, title, address)
  }

  async createBoundedSaleVote(address, stock, min, max, price, closes, title = 'Series Z') {
    const sale = await BoundedStandardSale.new(Company.address, stock, min, max, price, closes, title,
                           { from: address, gas: 3000000 })
    return await this.submitSale(sale, title, address)
  }

  async submitSale(sale, title, address) {
    await sale.setTxid(sale.transactionHash, { from: address, gas: 120000 })
    const saleVote = await StockSaleVoting.new(sale.address, title, 50, { from: address, gas: 2000000 })
    const oneWeekFromNow = +moment().add(7, 'days') / 1000
    console.log('submitting', saleVote)
    await saleVote.setTxid(saleVote.transactionHash, { from: address, gas: 120000 })
    return await Company.beginPoll(saleVote.address, oneWeekFromNow,
          { from: address, gas: 120000 * Stocks.find().count() })
  }

  get lastBlockKey() {
    return 'lB_ss'
  }

  get lastWatchedBlock() {
    return Session.get(this.lastBlockKey) || EthBlocks.latest.number
  }

  get lastBlock() {
    return EthBlocks.latest.number
  }

  set lastWatchedBlock(block) {
    return Session.setPersistent(this.lastBlockKey, block)
  }
}

_StockSalesWatcher = new StockSalesWatcher()

export default _StockSalesWatcher
