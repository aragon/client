import SHA256 from 'crypto-js/sha256'

import BrowserNotifications from './browser'

class NotificationsManager {
  constructor() {
    this.Notifications = new Mongo.Collection('notification_collection', { connection: null })
    this.persistentNotifications = new PersistentMinimongo(this.Notifications)
  }

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
      this.performNotificationAction(notification)
    })
  }

  performNotificationAction(notification) {
    this.Notifications.update(notification._id, { $set: { handled: true } })
    FlowRouter.go(notification.uri)
  }

  saveNotification(listener, ev, shown) {
    const hash = this.notificationHash(ev)
    const notification = {
      _id: this.notificationId(hash),
      body: listener.bodyFormatter(ev.args),
      uri: listener.uriFormatter(ev.args),
      title: listener.title,
      date: this.getBlockDate(ev.blockNumber),
      handled: false,
      hash,
      shown,
    }

    this.Notifications.upsert(notification._id, notification)
    this.lastWatchedBlock = ev.blockNumber

    return notification
  }

  getBlockDate(blockNumber) {
    const timestamp = (EthBlocks.findOne({ number: blockNumber }) || {}).timestamp
    return timestamp ? new Date(timestamp / 1000) : new Date()
  }

  notificationId(hash) {
    return `n_${hash}`
  }

  notificationHash(ev) {
    return SHA256(ev.blockHash, ev.transactionHash, ev.logIndex, ev.event)
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

const shared = new NotificationsManager()
Notifications = shared.Notifications

export default shared
