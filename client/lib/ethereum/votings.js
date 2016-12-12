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
    Stocks.find().observeChanges({
      added: (id, fields) => {
        Stock.at(fields.address).NewPoll().watch(async (err, ev) => {
          const votingAddr = await Company.votings.call(ev.args.id)
          self.getVoting(votingAddr, ev.args.id.toNumber())
        })
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

  async updateVoting(address, index) {
    const voting = Voting.at(address)
    const lastId = await voting.optionsIndex.call().then(x => x.toNumber())
    const optionsPromises = _.range(lastId).map(id => voting.options.call(id))
    const closingTime = await Stock.at(Stocks.findOne().address).pollingUntil
                              .call(index).then(x => x.toNumber())

    const supportNeeded = Promise.all([voting.neededSupport.call(), voting.supportBase.call()])
                            .then(([s, b]) => s / b)

    const votingObject = {
      title: voting.title.call(),
      description: voting.description.call(),
      options: Promise.all(optionsPromises),
      closingTime: new Date(closingTime),
      supportNeeded,
      index,
      address,
    }

    const votingInfo = await Promise.allProperties(votingObject)
    this.Votings.upsert(`s_${address}`, votingInfo)
  }
}

window.VotingWatcher = VotingWatcher

export default new VotingWatcher()
