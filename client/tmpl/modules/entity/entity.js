import ClosableSection from '/client/tmpl/elements/closableSection'

const tmpl = Template.module_entity
// TODO: The var and the view are dynamic. Think about a solution.
// Eg if it was a component, we could just listen to its unmount event
// and replace it with the prev view
ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')
