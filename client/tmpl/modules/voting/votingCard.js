import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Voting_Card.extend([ClosableSection])

tmpl.events({
  'click .button': () => (this.$('.dimmer').trigger('finished', { state: 'success' })),
  'success .dimmer': () => FlowRouter.go('/voting'),
})
