import VotingWatcher from '/client/lib/ethereum/votings'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/:id': (q) => {
    TemplateVar.set('rightSection', 'Module_Voting_Section')
    Template.instance().$('#votingSection').trigger('reload')
  },
})

tmpl.onCreated(() => TemplateVar.set('rightSection', 'Module_Voting_Empty'))

tmpl.onRendered(function () {
  this.$('.button.toggle').state()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click #pastVotings': () => (
    TemplateVar.set('pastVotings', !TemplateVar.get('pastVotings'))
  ),
  'click tbody tr': (e) => (FlowRouter.go(`/voting/${e.currentTarget.dataset.voting}`)),
})

tmpl.helpers({
  votings: () => Votings.find({ closingTime: { $gt: new Date() } }),
  pastVotings: () => Votings.find({ closingTime: { $lt: new Date() } }),
  displayOutcome: (outcome) => ((outcome) ? '👍' : '👎'),
})
