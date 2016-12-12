import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'

const Votings = VotingWatcher.Votings
const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const votingVar = new ReactiveVar()
const voteId = () => FlowRouter.current().params.id
const voting = () => Votings.findOne({ address: voteId() })
const canVote = async () => {
  const address = EthAccounts.findOne().address
  const vote = voting().index
  const allVotes = Stocks.find().fetch().map(s => Stock.at(s.address).canVote.call(address, vote))
  const allResults = await Promise.all(allVotes)
  // as long as it can vote in any stock, return true
  return allResults.reduce((v, acc) => v || acc, false)
}

tmpl.onCreated(() => {
  votingVar.set(voting())
})

tmpl.helpers({
  voting: () => votingVar.get(),
  options: () => voting().options,
  canVote: ReactivePromise(canVote),
})

const castVote = async option => {
  console.log('casting vote', voting().index, option, EthAccounts.findOne().address)
  const result = await Company.castVote(voting().index, option,
                  { from: EthAccounts.findOne().address, gas: 4800000 })
  console.log(result)
}

tmpl.events({
  'click .button': (e) => castVote($(e.currentTarget).data('option')),
  'success .dimmer': () => FlowRouter.go('/voting'),
  'reload #votingSection': () => votingVar.set(voting()),
})
