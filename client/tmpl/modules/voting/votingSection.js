import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'

const Votings = VotingWatcher.Votings
const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const votingVar = new ReactiveVar()
const updated = new ReactiveVar()

const voteId = () => FlowRouter.current().params.id
const voting = () => Votings.findOne({ address: voteId() })
const reload = () => {
  votingVar.set(voting())
  updated.set(Math.random())
}

const canVote = async () => {
  const address = EthAccounts.findOne().address
  const vote = voting().index
  const allVotes = Stocks.find().fetch().map(s => Stock.at(s.address).canVote.call(address, vote))
  const allResults = await Promise.all(allVotes)
  // as long as it can vote in any stock, return true
  return allResults.reduce((acc, v) => v || acc, false)
}

const countVotes = async (optionId) => {
  const counted = await Company.countVotes.call(voting().index, optionId)
  const votes = counted[0].toNumber()
  return { votes, relativeVotes: votes / counted[1].toNumber() }
}

const pendingVotes = async (options) => {
  const allOptions = await Promise.all(options.map((o, i) => Company.countVotes.call(voting().index, i)))
  const total = allOptions[0][1].toNumber()
  const allVotes = allOptions.reduce((acc, v) => acc + v[0].toNumber(), 0)
  const votes = total - allVotes
  return { votes, relativeVotes: votes / total }
}

tmpl.onCreated(() => {
  reload()
})

tmpl.helpers({
  updatesHack: () => updated.get(),
  voting: () => votingVar.get(),
  options: () => votingVar.get().options,
  canVote: ReactivePromise(canVote),
  countVotes: ReactivePromise(countVotes),
  pendingVotes: ReactivePromise(pendingVotes),
})

const castVote = async option => {
  console.log('casting vote', voting().index, option, EthAccounts.findOne().address)
  const result = await Company.castVote(voting().index, option,
                  { from: EthAccounts.findOne().address, gas: 4800000 })
  console.log(result)
  reload()
}

tmpl.events({
  'click .button': (e) => castVote($(e.currentTarget).data('option')),
  'success .dimmer': () => FlowRouter.go('/voting'),
  'reload #votingSection': reload,
})
