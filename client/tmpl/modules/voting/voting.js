const tmpl = Template.Module_Voting.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/:id': () => TemplateVar.set('rightSection', 'Module_Voting_Card'),
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
  votings: () => [
    {
      description: 'Issuing 1,000 new CVS shares',
      endTime: new Date(2016, 11, 10),
      address: 'manolo',
    },
    {
      description: 'Raising 1000BTC',
      endTime: new Date(2016, 11, 20),
      address: 'manolazo',
    },
  ],
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
