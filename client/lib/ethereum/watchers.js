// @flow
import Accounting from './accounting'
import BylawsWatcher from './bylaws'
import StatusWatcher from './statuses'
import StockWatcher from './stocks'
import StockSalesWatcher from './stocksales'

const watchers = [Accounting, BylawsWatcher, StatusWatcher, StockWatcher, StockSalesWatcher]

const initWatchers = () => {
  for (const w of watchers) {
    w.listen()
  }
}

export default initWatchers
