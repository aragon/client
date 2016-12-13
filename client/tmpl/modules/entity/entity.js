import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

const tmpl = Template.Module_Entity.extend([ClosableSection])

tmpl.helpers({
  address: () => FlowRouter.current().params.address,
  entity: ReactivePromise(async () => {
    if (FlowRouter.current()) {
      const dimmer = this.$('.dimmer')
      dimmer.trigger('loading')
      const entity = Identity.get(FlowRouter.current().params.address)
      if (dimmer) dimmer.trigger('finished')
      return entity
    }
    return null
  }),
  formatFingerprint: (fingerprint) => fingerprint.match(/.{1,4}/g).join(' '),
})
