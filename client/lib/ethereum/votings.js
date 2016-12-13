import { Stock, Voting } from './contracts'
import Company from './deployed'
import StockWatcher from './stocks'

const Stocks = StockWatcher.Stocks
const Votings = new Mongo.Collection('votings_collection', { connection: null })

class VotingWatcher {
  constructor() {
    this.setupCollections()
    this.getAllVotings()
    this.listenForNewVotings()
  }

  setupCollections() {
    this.Votings = Votings
    this.persistentStock = new PersistentMinimongo(this.Votings)
  }

  listenForNewVotings() {
    const self = this
    const watch = async (err, ev) => {
      const votingAddr = await Company.votings.call(ev.args.id)
      console.log('updated voting', ev.args.id)
      self.getVoting(votingAddr, ev.args.id.toNumber())
    }

    Company.VoteExecuted().watch(watch)

    Stocks.find().observeChanges({
      added: (id, fields) => {
        Stock.at(fields.address).NewPoll().watch(watch)
        Stock.at(fields.address).VoteCasted().watch(watch)
      },
    })
  }

  async getAllVotings() {
    const lastId = await Company.votingIndex.call().then(x => x.toNumber())
    const addressesPromises = _.range(lastId - 1).map(id => Company.votings.call(id + 1))
    const votingAddresses = await Promise.all(addressesPromises)
    await Promise.all(votingAddresses.map((a, i) => this.getVoting(a, i + 1)))

    this.Votings.remove({ address: { $nin: votingAddresses } })
  }

  async getVoting(address, index) {
    await this.updateVoting(address, index)
  }

  async countVotes(index, optionId) {
    const counted = await Company.countVotes.call(index, optionId)
    const votes = counted[0].toNumber()
    return { votes, relativeVotes: votes / counted[1].toNumber() }
  }

  async updateVoting(address, index) {
    const voting = Voting.at(address)
    const lastId = await voting.optionsIndex.call().then(x => x.toNumber())
    const ids = _.range(lastId)
    const optionsPromises = ids.map(id => voting.options.call(id))
    const votes = ids.map(id => this.countVotes(index, id))
    const closingTime = await Stock.at(Stocks.findOne().address).pollingUntil
                              .call(index).then(x => x.toNumber())

    const supportNeeded = Promise.all([voting.neededSupport.call(), voting.supportBase.call()])
                            .then(([s, b]) => s / b)
    const voteExecuted = Company.voteExecuted.call(index)
                            .then(x => Promise.resolve(x.toNumber()))
                            .then(x => (x > 0 ? x - 10 : null))

    const votingObject = {
      title: voting.title.call(),
      description: voting.description.call(),
      options: Promise.all(optionsPromises),
      closingTime: new Date(closingTime * 1000),
      voteCounts: Promise.all(votes),
      voteExecuted,
      supportNeeded,
      index,
      address,
    }

    const votingInfo = await Promise.allProperties(votingObject)
    console.log('setting new', votingInfo)
    this.Votings.upsert(`s_${address}`, votingInfo)
  }
}

window.VotingWatcher = VotingWatcher

export default new VotingWatcher()
