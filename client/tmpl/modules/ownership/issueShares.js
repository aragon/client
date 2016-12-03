import ClosableSection from '/client/tmpl/elements/closableSection'

const tmpl = Template.module_ownershipAssignShares
ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')

tmpl.onRendered = () => {
  this.$('.dropdown').dropdown()
}
