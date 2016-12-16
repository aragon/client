import { Stock, Voting } from './contracts'
import Company from './deployed'
import StockWatcher from './stocks'

const Stocks = StockWatcher.Stocks
const Votings = new LocalCollection('votings')

class VotingWatcher {
  constructor() {
    this.setupCollections()
    this.getMissingVotings()
    this.listenForUpdates()
  }

  setupCollections() {
    this.Votings = Votings
    this.persistentStock = new PersistentMinimongo(this.Votings)
  }

  listenForUpdates() {
    const self = this
    const watch = async (err, ev) => {
      const votingAddr = await Company.votings.call(ev.args.id)
      self.getVoting(votingAddr, ev.args.id.toNumber())
      this.lastWatchedBlock = ev.blockNumber
    }

    const get = async (err, evs) => {
      await Promise.all(evs.map(ev => watch(err, ev)))
    }

    Company.VoteExecuted().watch(watch)

    Stocks.find().observeChanges({
      added: (id, fields) => {
        if (this.lastWatchedBlock > this.lastBlock) {
          this.lastWatchedBlock = this.lastBlock
        }
        const threshold = this.lastBlock
        const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
        const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

        Stock.at(fields.address).NewPoll({}, streamingPredicate).watch(watch)
        Stock.at(fields.address).VoteCasted({}, streamingPredicate).watch(watch)

        Stock.at(fields.address).NewPoll({}, missedPredicate).get(get)
        Stock.at(fields.address).VoteCasted({}, missedPredicate).get(get)
      },
    })
  }

  async getMissingVotings() {
    const lastId = await Company.votingIndex.call().then(x => x.toNumber())
    const addressesPromises = _.range(lastId - 1).map(id => Company.votings.call(id + 1))
    const votingAddresses = await Promise.all(addressesPromises)
    const fetchingVotes = votingAddresses.map((a, i) => {
      if (this.Votings.findOne({ address: a })) { return null } // Filter existing
      return this.getVoting(a, i + 1)
    })

    await Promise.all(fetchingVotes)

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

    this.Votings.upsert({ _id: `s_${address}` }, votingInfo)
  }

  get lastBlockKey() {
    return 'lB_v'
  }

  get lastWatchedBlock() {
    return Session.get(this.lastBlockKey) || EthBlocks.latest.number
  }

  get lastBlock() {
    return EthBlocks.latest.number
  }

  set lastWatchedBlock(block) {
    return Session.setPersistent(this.lastBlockKey, block)
  }
}

window.VotingWatcher = VotingWatcher

export default new VotingWatcher()
