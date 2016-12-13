import BrowserNotifications from './browser'

class NotificationsManager {
  listen(listeners) {
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    listeners.forEach(listener => {
      listener.ev(listener.predicate, missedPredicate)
        .get((err, evs) => evs.forEach(ev => this.saveNotification(listener, ev, true)))
      listener.ev(listener.predicate, streamingPredicate)
        .watch((err, ev) => {
          if (ev.blockNumber > threshold) {
            this.showNotification(listener, ev)
          }
        })
    })
  }

  showNotification(listener, ev) {
    const notification = this.saveNotification(listener, ev, false)
    BrowserNotifications.showNotification(notification.title, notification.body, () => {
      console.log('clicked notification', notification)
    })
  }

  saveNotification(listener, ev, seen) {
    console.log('attemp save', ev.args, seen)
    if (!ev.args) return null

    const notification = {
      body: listener.bodyFormatter(ev.args),
      uri: listener.uriFormatter(ev.args),
      title: listener.title,
      seen,
    }

    this.lastWatchedBlock = ev.blockNumber

    return notification
  }

  get lastBlockKey() {
    return 'lB'
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

export default NotificationsManager
