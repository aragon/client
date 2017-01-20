// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'

import { NotificationsManager } from '/client/lib/notifications'

const Notifications = NotificationsManager.Notifications

const tmpl = Template.Module_Inbox

const performAction = id =>
    NotificationsManager.performNotificationAction(Notifications.findOne(id))

const clearAll = () =>
    Notifications.update({ handled: false }, { handled: true }, { multi: true })

tmpl.helpers({
  unhandledNotifs: () => Notifications.find({ handled: false }, { sort: { date: -1 } }),
})

tmpl.events({
  'click .action': e => performAction($(e.currentTarget).data('notification')),
  'click .clear-all': clearAll,
})
