import { NotificationsManager } from '/client/lib/notifications'

const Notifications = NotificationsManager.Notifications

const tmpl = Template.Module_Inbox

const performAction = id =>
    NotificationsManager.performNotificationAction(Notifications.findOne(id))

const clearAll = () =>
    Notifications.update({ handled: false }, { handled: true }, { multi: true })

tmpl.helpers({
  unhandledNotis: () => Notifications.find({ handled: false }, { sort: { date: -1 } }),
    /*
    [{
      icon: 'check',
      from: 'Manolo',
      request: 'Sign transaction',
      time: '10/10/2016',
      actionIcon: 'write',
      action: 'Sign',
    }, {
      icon: 'money',
      from: 'Fred Wilson',
      request: '1,000BTC Investment',
      time: '10/10/2016',
    }]
  ),*/
})

tmpl.events({
  'click .action': e => performAction($(e.currentTarget).data('notification')),
  'click .clear-all': clearAll
})
