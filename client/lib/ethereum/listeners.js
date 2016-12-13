import { NotificationsListener as Listener } from '/client/lib/notifications'

import Company from './deployed'
import { Stock, Voting } from './contracts'

class Listeners {
  static all() {
    return [this.issueStockListener, this.executedVotingListener]
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
      (args) => `/voting/${args.id}`,
    )
  }
}

export default Listeners
