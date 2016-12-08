const tmpl = Template.Module_Voting.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/:id': () => TemplateVar.set('rightSection', 'Module_Voting_Card'),
})

tmpl.onCreated(() => {
  TemplateVar.set('rightSection', 'Module_Voting_Empty')
})

tmpl.onRendered(() => {
  this.$('.button.toggle').state()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click #pastVotings': () => (
    TemplateVar.set('pastVotings', !TemplateVar.get('pastVotings'))
  ),
  'click table tr': () => {
    // TemplateVar.set('rightSection', 'Module_Voting_Card')
    FlowRouter.go('/voting/0')
  },
  'closed div': () => {
    TemplateVar.set('rightSection', 'Module_Voting_Empty')
    FlowRouter.go('/voting')
  },
})

tmpl.helpers({
  votings: () => [
    {
      description: 'Issuing 1,000 new CVS shares',
      endTime: new Date(2016, 11, 10),
    },
    {
      description: 'Raising 1000BTC',
      endTime: new Date(2016, 11, 20),
    },
  ],
  pastVotings: () => [
    {
      description: 'Issuing 2,000 new CVS shares',
      outcome: true,
    },
    {
      description: 'Raising 1BTC',
      outcome: false,
    },
  ],
  now: () => (moment()),
  timeRange: (a, b) => (moment(a).twix(b).humanizeLength()),
  displayOutcome: (outcome) => ((outcome) ? '👍' : '👎'),
})
