// @flow
import Accounting from './accounting'
import BylawsWatcher from './bylaws'
import StatusWatcher from './statuses'
import StockWatcher from './stocks'
import StockSalesWatcher from './stocksales'
import VotingWatcher from './votings'

import Watcher from './watcher'

const watchers: Array<Watcher> = [
  Accounting,
  BylawsWatcher,
  StatusWatcher,
  StockWatcher,
  StockSalesWatcher,
  VotingWatcher,
]

const initWatchers = () => {
  for (const w of watchers) {
    w.listen()
  }
}

export default initWatchers
