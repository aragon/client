// @flow
import { _ } from 'meteor/underscore'

import { NotificationsListener as Listener } from '/client/lib/notifications'
import Identity from '/client/lib/identity'
import utils from 'ethereumjs-util'

import Company from './deployed'
import { Stock, Voting, StockSale } from './contracts'

const flatten = (array) => [].concat(...array)

class Listeners {
  static async all() {
    const stocks = await this.allStocks()

    return [this.issueStockListener, this.executedVotingListener, this.newSaleListener, this.bylawChangedListener]
            .concat(await this.shareTransfers(stocks))
            .concat(stocks.map(this.newPollListener))
  }

  static get issueStockListener() {
    const body = async args => {
      const symbol = await Stock.at(args.stockAddress).symbol.call()
      return `${args.amount} ${symbol} shares have been issued`
    }

    return new Listener(
      Company().IssuedStock,
      'Stock issued',
      body,
      () => '/ownership',
    )
  }

  static async shareTransfers(stocks) {
    const address = Identity.current(true).ethereumAddress
    const sharesTransfers = stocks.map(stock =>
      ([this.sharesSent(stock, address), this.sharesReceived(stock, address)]),
    )
    return await Promise.all(flatten(sharesTransfers))
  }

  static async sharesSent(stock, address) {
    return await this.sharesTransferred(stock, { from: address }, 'sent')
  }

  static async sharesReceived(stock, address) {
    return await this.sharesTransferred(stock, { to: address }, 'received')
  }

  static async sharesTransferred(stockAddress, predicate, verb) {
    const stock = Stock.at(stockAddress)
    const symbol = await stock.symbol.call()

    const body = async args => `You just ${verb} ${args.value} ${symbol} shares`

    return new Listener(
      stock.Transfer,
      'Shares transfer',
      body,
      () => '/ownership',
      '',
      predicate,
    )
  }

  static newPollListener(stock) {
    const body = async () => 'New voting was created. You can now vote.'

    return new Listener(
      Stock.at(stock).NewPoll,
      'Voting started',
      body,
      args => `/voting/${args.id.valueOf()}`,
      'Vote now',
      {},
      args => utils.bufferToHex(utils.sha3(args.id.valueOf() + args.closes.valueOf()))
    )
  }

  static get bylawChangedListener() {
    const body = args => `Signature: ${args.functionSignature}`
    return new Listener(
      Company().BylawChanged,
      'Bylaw changed',
      body,
      args => `/bylaws/${args.functionSignature}`,
    )
  }

  static get newSaleListener() {
    const body = async args => `New fundraising started shares at ${await StockSale.at(args.saleAddress).getBuyingPrice.call(1).then(x => web3.fromWei(x.toNumber()), 'ether')} ETH price`
    return new Listener(
      Company().NewStockSale,
      'New sale',
      body,
      args => `/fundraising/${args.saleIndex.valueOf()}`,
      'See sale',
    )
  }

  static get executedVotingListener() {
    const body = async args => {
      const winner = await Voting.at(args.votingAddress).options.call(args.outcome)
      return `Outcome was '${winner}'`
    }

    return new Listener(
      Company().VoteExecuted,
      'Voting finished',
      body,
      (args) => `/voting/${args.id.valueOf()}`,
    )
  }

  static async allStocks() {
    const lastId = await Company().stockIndex.call().then(x => x.valueOf())
    const addressesPromises = _.range(lastId).map(id => Company().stocks.call(id))
    return await Promise.all(addressesPromises)
  }
}

export default Listeners
