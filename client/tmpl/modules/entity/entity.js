import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

const tmpl = Template.Module_Entity.extend([ClosableSection])

const getEntity = async () => {
  if (FlowRouter.current()) return Identity.get(FlowRouter.current().params.address)
  return null
}

tmpl.helpers({
  address: () => FlowRouter.current().params.address,
  entity: ReactivePromise(getEntity),
  formatFingerprint: (fingerprint) => fingerprint.match(/.{1,4}/g).join(' '),
})
