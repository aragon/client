import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const voting = () => Votings.findOne({ address: FlowRouter.current().params.id })
tmpl.helpers({
  voting,
  options: (o) => voting().options,
})

const castVote = option => {

}

tmpl.events({
  'click .button': (e) => castVote($(e.currentTarget).data('option')),
  'success .dimmer': () => FlowRouter.go('/voting'),
})
