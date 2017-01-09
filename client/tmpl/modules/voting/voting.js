import VotingWatcher from '/client/lib/ethereum/votings'

Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting.extend()
const selectedVoting = new ReactiveVar()

const togglePastVotings = () => {
  // HACK: if url continues being /voting/:id it won't change on next url change to same resource
  TemplateVar.set('pastVotings', !TemplateVar.get('pastVotings'))
  FlowRouter.go('/voting' + (TemplateVar.get('pastVotings') ? '?past' : ''))
}

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Voting_Empty'),
  '/new': () => TemplateVar.set('rightSection', 'Module_Voting_New'),
  '/:id': () => {
    TemplateVar.set('rightSection', 'Module_Voting_Section')
    Template.instance().$('#votingSection').trigger('reload')
    const id = FlowRouter.current().params.id
    selectedVoting.set(Votings.findOne({ $or: [{ address: id }, { index: +id }] }))
  },
  '/:id/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onCreated(() => {
  TemplateVar.set('rightSection', 'Module_Voting_Empty')
})

tmpl.onRendered(function () {
  this.autorun(function() {
    const vote = selectedVoting.get()
    if (vote) {
      const isClosed = vote.voteExecuted !== null || vote.closingTime < new Date()
      TemplateVar.set('pastVotings', isClosed)
    } else {
      const pastQuery = FlowRouter.current().queryParams.past !== undefined
      TemplateVar.set('pastVotings', pastQuery)
    }
  })
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click #pastVotings': togglePastVotings,
  'click #votings tbody tr': (e) => FlowRouter.go(`/voting/${e.currentTarget.dataset.voting}`),
})

tmpl.helpers({
  votings: () => Votings.find({ voteExecuted: null, closingTime: { $gt: +new Date() } }),
  pastVotings: () => Votings.find({ $or: [{ voteExecuted: { $ne: null } },
                      { closingTime: { $lt: +new Date() } }] }),
  isSelected: address => selectedVoting.get() && selectedVoting.get().address === address,
})
