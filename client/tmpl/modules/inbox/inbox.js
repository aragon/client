const tmpl = Template.Module_Inbox

tmpl.helpers({
  items: () => (
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
  ),
})
