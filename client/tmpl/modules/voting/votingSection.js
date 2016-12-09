import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'
import Company from '/client/lib/ethereum/deployed'

const Votings = VotingWatcher.Votings

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const votingVar = new ReactiveVar()
const voting = () => Votings.findOne({ address: FlowRouter.current().params.id })

tmpl.onCreated(() => {
  votingVar.set(voting())
})

tmpl.helpers({
  voting: () => votingVar.get(),
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
  'reload #votingSection': () => votingVar.set(voting()),
})
