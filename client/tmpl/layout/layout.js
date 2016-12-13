const tmpl = Template.Layout

tmpl.helpers({
  notificationsPending: () => Notifications.find({ handled: false }).count() > 0,
})
