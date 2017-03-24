// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'

import { NotificationsManager } from '/client/lib/notifications'

const Notifications = NotificationsManager.Notifications

const tmpl = Template.Layout_Inbox

const performAction = id =>
    NotificationsManager.performNotificationAction(Notifications.findOne(id))

const clearAll = () =>
    Notifications.update({ handled: false }, { handled: true }, { multi: true })

tmpl.onRendered(() => {
  $('#inboxButton').popup({
    inline: true,
    on: 'click',
    lastResort: 'bottom center',
    position: 'bottom center',
    onShow: () => (window.resizePopups()),
  })
})

tmpl.helpers({
  unhandledNotifs: () => Notifications.find({ handled: false }, { sort: { date: -1 } }),
})

tmpl.events({
  'click .extra a': e => performAction($(e.currentTarget).data('notification')),
  'click #notifHeader i': clearAll,
})
