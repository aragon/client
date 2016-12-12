import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

const tmpl = Template.Module_Entity.extend([ClosableSection])

tmpl.onCreated(() => {
  console.log(FlowRouter.current().params.address)
})

tmpl.helpers({
  address: () => FlowRouter.current().params.address,
  entity: () => Identity.get(FlowRouter.current().params.address),
})
