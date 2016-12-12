import VotingWatcher from '/client/lib/ethereum/votings'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting.extend()
const selectedVoting = new ReactiveVar()


tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/:id': () => {
    TemplateVar.set('rightSection', 'Module_Voting_Section')
    Template.instance().$('#votingSection').trigger('reload')
    selectedVoting.set(FlowRouter.current().params.id)
  },
})

tmpl.onCreated(() => {
  TemplateVar.set('rightSection', 'Module_Voting_Empty')
  selectedVoting.set(FlowRouter.current().params.id)
})

tmpl.onRendered(function () {
  this.$('.button.toggle').state()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click #pastVotings': () => (
    TemplateVar.set('pastVotings', !TemplateVar.get('pastVotings'))
  ),
  'click #votings tbody tr': (e) => (FlowRouter.go(`/voting/${e.currentTarget.dataset.voting}`)),
})

tmpl.helpers({
  votings: () => Votings.find({ closingTime: { $gt: new Date() } }),
  pastVotings: () => Votings.find({ closingTime: { $lt: new Date() } }),
  displayOutcome: (outcome) => ((outcome) ? '👍' : '👎'),
  isSelected: id => id === selectedVoting.get(),
})
