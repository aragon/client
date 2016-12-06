Template.el_processDimmer.rendered = () => {
  const tmplIns = Template.instance()
  const dimmer = this.$('.dimmer')

  Tracker.autorun(() => {
    const state = TemplateVar.get(tmplIns, 'state')
    dimmer.dimmer(state ? 'show' : 'hide')
    if (state === 'success') {
      setTimeout(() => {
        TemplateVar.set(tmplIns, 'state', null)
        const cb = tmplIns.data.onSuccess
        if (cb) cb()
      }, 2500)
    }
  })
}

Template.el_processDimmer.helpers({
  state: () => TemplateVar.get('state'),
})
