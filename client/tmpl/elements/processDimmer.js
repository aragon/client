const tmpl = Template.Element_ProcessDimmer.extend()

tmpl.events({
  'finished .dimmer': (e, instance, data) => {
    const dimmer = instance.$('.dimmer')
    TemplateVar.set(instance, 'state', data.state)
    dimmer.dimmer(data.state ? 'show' : 'hide')
    if (data.state === 'success') {
      setTimeout(() => (dimmer.trigger('success')), 2500)
    }
  },
})
