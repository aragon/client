import SHA256 from 'crypto-js/sha256'

import BrowserNotifications from './browser'

class NotificationsManager {
  constructor() {
    this.Notifications = new Mongo.Collection('notification_collection', { connection: null })
    this.persistentNotifications = new PersistentMinimongo(this.Notifications)
  }

  listen(listeners) {
    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    console.log(threshold)
    console.log(this.lastWatchedBlock)
    console.log(missedPredicate)
    console.log(streamingPredicate)

    listeners.forEach(listener => {
      listener.ev(listener.predicate, missedPredicate)
        .get(async (err, evs) => {
          await Promise.all(evs.map(ev => this.saveNotification(listener, ev, true)))
          this.sendMissingNotification(evs.length)
        })
      listener.ev(listener.predicate, streamingPredicate)
        .watch(async (err, ev) => {
          console.log('watch', ev)
          if (ev.blockNumber > threshold) {
            await this.showNotification(listener, ev)
          }
        })
    })
  }

  sendMissingNotification(count) {
    if (!(count > 0)) { return }
    const title = 'Missing notifications'
    const body = `You got ${count} notifications while you were away`
    BrowserNotifications.showNotification(title, body, () => FlowRouter.go('/inbox'))
  }

  async showNotification(listener, ev) {
    const notification = await this.saveNotification(listener, ev, false)
    BrowserNotifications.showNotification(notification.title, notification.body, () => {
      this.performNotificationAction(notification)
    })
  }

  performNotificationAction(notification) {
    this.Notifications.update(notification._id, { $set: { handled: true } })
    FlowRouter.go(notification.uri)
  }

  async saveNotification(listener, ev, shown) {
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

    const notificationDetails = await Promise.allProperties(notification)

    this.Notifications.upsert(notification._id, notificationDetails)
    this.lastWatchedBlock = ev.blockNumber

    return notificationDetails
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
