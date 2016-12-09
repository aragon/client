import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const voting = () => Votings.findOne({ address: FlowRouter.current().params.id })
tmpl.helpers({
  voting,
  options: () => voting().options,
})

const castVote = async option => {
  const result = await Company.castVote(voting().index, option,
                  { from: EthAccounts.findOne().address, gas: 4800000 })
  console.log(result)
}

tmpl.events({
  'click .button': (e) => castVote($(e.currentTarget).data('option')),
  'success .dimmer': () => FlowRouter.go('/voting'),
})
