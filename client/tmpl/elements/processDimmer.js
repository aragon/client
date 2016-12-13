const tmpl = Template.Element_ProcessDimmer

tmpl.events({
  'loading .dimmer': (e, instance) => {
    TemplateVar.set(instance, 'state', 'loading')
    instance.$('.dimmer').dimmer('show')
  },
  'finished .dimmer': (e, instance, data) => {
    const dimmer = instance.$('.dimmer')
    TemplateVar.set(instance, 'state', data.state)
    console.log(data.state)
    dimmer.dimmer(data.state ? 'show' : 'hide')
    if (data.state === 'success') {
      setTimeout(() => (dimmer.trigger('success')), 2500)
    }
  },
})
