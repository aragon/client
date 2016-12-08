import VotingWatcher from '/client/lib/ethereum/votings'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/:id': () => TemplateVar.set('rightSection', 'Module_Voting_Section'),
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
  votings: () => Votings.find(),
  pastVotings: () => [
    {
      description: 'Issuing 2,000 new CVS shares',
      outcome: true,
      address: 'pastManolo',
    },
    {
      description: 'Raising 1BTC',
      outcome: false,
      address: 'pastManolazo',
    },
  ],
  now: () => (moment()),
  timeRange: (a, b) => (moment(a).twix(b).humanizeLength()),
  displayOutcome: (outcome) => ((outcome) ? '👍' : '👎'),
})
