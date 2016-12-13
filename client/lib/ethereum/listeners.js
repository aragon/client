import { NotificationsListener as Listener } from '/client/lib/notifications'
import SHA256 from 'crypto-js/sha256'

import Company from './deployed'
import { Stock, Voting } from './contracts'

class Listeners {
  static async all() {
    const stocks = await this.allStocks()

    return [this.issueStockListener, this.executedVotingListener]
            .concat(stocks.map(this.newPollListener))
  }

  static get issueStockListener() {
    const body = async args => {
      const symbol = await Stock.at(args.stockAddress).symbol.call()
      return `${args.amount} ${symbol} shares have been issued`
    }

    return new Listener(
      Company.IssuedStock,
      'Stock issued',
      body,
      () => '/ownership',
    )
  }

  static newPollListener(stock) {
    const body = async args => {
      const votingAddress = await Company.votings.call(args.id)
      const title = await Voting.at(votingAddress).title.call()
      return `New vote '${title}' was created. You can now vote.`
    }

    return new Listener(
      Stock.at(stock).NewPoll,
      'New vote',
      body,
      args => `/voting/${args.id.valueOf()}`,
      {},
      args => SHA256(args.id.valueOf() + args.closes.valueOf()).toString(),
    )
  }

  static get executedVotingListener() {
    const body = async args => {
      const title = await Voting.at(args.votingAddress).title.call()
      const winner = await Voting.at(args.votingAddress).options.call(args.outcome)
      return `'${title}' voting outcome was '${winner}'`
    }

    return new Listener(
      Company.VoteExecuted,
      'Vote finished',
      body,
      (args) => `/voting/${args.id.valueOf()}`,
    )
  }

  static async allStocks() {
    const lastId = await Company.stockIndex.call().then(x => x.valueOf())
    const addressesPromises = _.range(lastId).map(id => Company.stocks.call(id))
    return await Promise.all(addressesPromises)
  }
}

export default Listeners
