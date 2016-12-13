import { NotificationsListener as Listener } from '/client/lib/notifications'

import Company from './deployed'
import { Stock } from './contracts'

class Listeners {
  static all() {
    return [this.issueStockListener]
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
}

export default Listeners
