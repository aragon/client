import ClosableSection from '/client/tmpl/components/closableSection'
import VotingWatcher from '/client/lib/ethereum/votings'
import StockWatcher from '/client/lib/ethereum/stocks'
import Company from '/client/lib/ethereum/deployed'
import { Stock, Voting } from '/client/lib/ethereum/contracts'

const Votings = VotingWatcher.Votings
const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Voting_Section.extend([ClosableSection])

const votingVar = new ReactiveVar()
const updated = new ReactiveVar()

const voteId = () => FlowRouter.current().params.id
const voting = () => Votings.findOne({ $or: [{ address: voteId() }, { index: +voteId() }] })

const reload = () => {
  votingVar.set(voting())
  updated.set(Math.random())
}

const allStocks = () => Stocks.find().fetch().map(s => Stock.at(s.address))

const canVote = async () => {
  const address = EthAccounts.findOne().address
  const vote = voting().index
  const allVotes = allStocks().map(stock => stock.canVote.call(address, vote))
  const allResults = await Promise.all(allVotes)
  // as long as it can vote in any stock, return true
  return allResults.reduce((acc, v) => v || acc, false)
}

const votingPower = async () => {
  const address = EthAccounts.findOne().address
  const vote = voting().index
  const allPower = allStocks().map(stock => stock.votingPowerForPoll.call(address, vote))
  const allVotes = await Promise.all(allPower)
  return allVotes.reduce((acc, v) => acc + v.toNumber(), 0)
}

// Pending votes stays here as it has to be updated in real time when more shares are assigned.
const pendingVotes = async (options) => {
  const vs = options.map((o, i) => Company.countVotes.call(voting().index, i))
  const allOptions = await Promise.all(vs)
  const total = allOptions[0][1].toNumber()
  const allVotes = allOptions.reduce((acc, v) => acc + v[0].toNumber(), 0)
  const votes = total - allVotes
  return { votes, relativeVotes: votes / total }
}

const canExecute = async (voteCounts, options) => {
  if (voting().voteExecuted !== null) return null
  const possitiveVotes = voteCounts[0]
  if (possitiveVotes.relativeVotes > voting().supportNeeded) {
    return { sentiment: 'primary', index: 0, name: options[0] }
  }

  const negativeVotes = voteCounts[1]
  if (negativeVotes.relativeVotes > 1 - voting().supportNeeded) {
    return { sentiment: 'negative', index: 1, name: options[1] }
  }

  return null
}

tmpl.onCreated(function () {
  this.autorun(() => {
    reload()
  })
})

tmpl.helpers({
  updatesHack: () => updated.get(),
  voting: () => votingVar.get(),
  options: () => votingVar.get().options,
  voteCounts: () => votingVar.get().voteCounts,
  isClosed: vote => vote.voteExecuted !== null || vote.closingTime < new Date(),
  canVote: ReactivePromise(canVote),
  pendingVotes: ReactivePromise(pendingVotes),
  votingPower: ReactivePromise(votingPower),
  executingOption: ReactivePromise(canExecute),
})

const castVote = async option => {
  await Company.castVote(voting().index, option,
                  { from: EthAccounts.findOne().address, gas: 4800000 })
  reload()
}

const executeVote = async option => {
  await Voting.at(voting().address).executeOnAction(option, Company.address,
                  { from: EthAccounts.findOne().address, gas: 4800000 })
  reload()
}

tmpl.events({
  'click .voting.button': (e) => castVote($(e.currentTarget).data('option')),
  'click .execute.button': (e) => executeVote($(e.currentTarget).data('option')),
  'success .dimmer': () => FlowRouter.go('/voting'),
  'reload #votingSection': reload,
})
