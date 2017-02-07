// @flow
import { Mongo } from 'meteor/mongo'
import { Session } from 'meteor/session'
import { EthBlocks } from 'meteor/ethereum:blocks'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'
import SHA256 from 'crypto-js/sha256'

import Watcher from '../ethereum/watcher'
import BrowserNotifications from './browser'

class NotificationsManager extends Watcher {
  Notifications: Mongo.Collection
  persistentNotifications: PersistentMinimongo

  constructor() {
    super('n')
    this.Notifications = new Mongo.Collection('notification', { connection: null })
    this.persistentNotifications = new PersistentMinimongo(this.Notifications)
  }

  listen(listeners: Array<Function>) {
    listeners.forEach(listener => {
      listener.ev(listener.predicate, this.missedPredicate)
        .get(async (err, evs) => {
          const notis = evs.map(ev => this.saveNotification(listener, ev, true))
          const filtered = (await Promise.all(notis)).filter(x => x !== null)

          this.sendMissingNotification(filtered.length)
        })
      listener.ev(listener.predicate, this.streamingPredicate)
        .watch(async (err, ev) => {
          if (ev.blockNumber > this.threshold()) {
            await this.showNotification(listener, ev)
          }
        })
    })
  }

  sendMissingNotification(count: number) {
    if (!(count > 0)) { return }
    const title = 'Missing notifications'
    const body = `You got ${count} notifications while you were away`
    BrowserNotifications.showNotification(title, body, () => FlowRouter.go('/inbox'))
  }

  async showNotification(listener, ev) {
    const notification = await this.saveNotification(listener, ev, false)

    if (!notification) { return }

    BrowserNotifications.showNotification(notification.title, notification.body, () => {
      this.performNotificationAction(notification)
    })
  }

  performNotificationAction(notification) {
    this.Notifications.update(notification._id, { $set: { handled: true } })
    FlowRouter.go(notification.uri)
  }

  async saveNotification(listener, ev, shown) {
    const hash = listener.uid(ev.args) || this.notificationHash(ev)
    const _id = this.notificationId(hash)

    if (this.Notifications.findOne(_id)) { return null } // Already processed with that id

    const notification = {
      body: listener.bodyFormatter(ev.args),
      uri: listener.uriFormatter(ev.args),
      title: listener.title,
      date: this.getBlockDate(ev.blockNumber),
      handled: false,
      callToAction: listener.callToAction,
      _id,
      hash,
      shown,
    }

    // Add empty before awaiting in case same notification comes in while fetching.
    this.Notifications.upsert({ _id: notification._id }, {})

    const notificationDetails = await Promise.allProperties(notification)

    this.Notifications.upsert({ _id: notification._id }, notificationDetails)

    return notificationDetails
  }

  getBlockDate(blockNumber: number) {
    const timestamp = (EthBlocks.findOne({ number: blockNumber }) || {}).timestamp
    return timestamp ? new Date(timestamp / 1000) : new Date()
  }

  notificationId(hash: string) {
    return `n_${hash}`
  }

  notificationHash(ev) {
    return SHA256(ev.blockHash + ev.transactionHash + ev.logIndex + ev.event).toString()
  }
}

const shared = new NotificationsManager()
Notifications = shared.Notifications

export default shared
