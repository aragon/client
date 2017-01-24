import { actionFromData, decode } from '/client/lib/action-dispatcher/decoder'

import { Stock, Voting, GenericBinaryVoting, Poll } from './contracts'
import Company from './deployed'
import StockWatcher from './stocks'
import verifyContractCode from './verify'

const Stocks = StockWatcher.Stocks
const Votings = new Mongo.Collection('votings', { connection: null })

class VotingWatcher {
  constructor() {
    this.setupCollections()
  }

  listen() {
    this.getMissingVotings()
    this.listenForUpdates()
  }

  setupCollections() {
    this.Votings = Votings
    this.persistentVotings = new PersistentMinimongo(this.Votings)
  }

  listenForUpdates() {
    const self = this

    const watch = async (err, ev) => {
      const votingAddr = await Company.votings.call(ev.args.id)
      self.getVoting(votingAddr, ev.args.id.toNumber())
      this.lastWatchedBlock = ev.blockNumber
    }

    const watchBylaw = (err, ev) => {
      const affectedVotings = Votings.find({ mainSignature: ev.args.functionSignature, voteExecuted: null, closingTime: { $gt: +new Date() } })
      affectedVotings.forEach(v => self.getVoting(v.address, v.index))

      this.lastWatchedBlock = ev.blockNumber
    }

    const get = async (err, evs) => {
      await Promise.all(evs.map(ev => watch(err, ev)))
    }

    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    Company.VoteExecuted({}, missedPredicate).get(get)
    Company.VoteExecuted({}, streamingPredicate).watch(watch)

    Company.BylawChanged({}, missedPredicate).get((err, evs) => evs.map(ev => watchBylaw(err, ev)))
    Company.BylawChanged({}, streamingPredicate).watch(watchBylaw)

    Stocks.find().observeChanges({
      added: (id, fields) => {
        Stock.at(fields.address).NewPoll({}, streamingPredicate).watch(watch)
        Stock.at(fields.address).VoteCasted({}, streamingPredicate).watch(watch)

        Stock.at(fields.address).NewPoll({}, missedPredicate).get(get)
        Stock.at(fields.address).VoteCasted({}, missedPredicate).get(get)
      },
    })
  }

  async getMissingVotings() {
    const lastId = await Company.votingIndex.call().then(x => x.toNumber())
    const addressesPromises = _.range(1, lastId).map(id => Company.votings.call(id))
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

    const votingSupport = voting.votingSupport.call(Company.address)

    const supportNeeded = votingSupport.then(([s, b]) => s / b)
    const relativeMajorityOnClose = votingSupport.then(([s, b, r]) => r)

    const voteExecuted = Company.voteExecuted.call(index)
                            .then(x => Promise.resolve(x.toNumber()))
                            .then(x => (x > 0 ? x - 10 : null))

    const verifiedContract = await this.verifyVote(address)

    if (!verifiedContract) {
      return console.error('Unknown voting')
    }

    const votingObject = {
      title: verifiedContract.title(address),
      description: verifiedContract.description(address),
      options: Promise.all(optionsPromises),
      closingTime: +new Date(closingTime * 1000),
      voteCounts: Promise.all(votes),
      creator: voting.creator.call(),
      mainSignature: voting.mainSignature.call(),
      voteExecuted,
      supportNeeded,
      relativeMajorityOnClose,
      index,
      address,
    }

    const votingInfo = await Promise.allProperties(votingObject)

    this.Votings.upsert({ _id: `v_${address}` }, votingInfo)
  }

  // Returns vote type
  async verifyVote(address) {
    const voteContracts = this.allVotes.map(x => x.contractClass)
    const verifiedContract = await verifyContractCode(address, voteContracts)

    if (!verifiedContract) { return null }
    return this.allVotes.filter(x => verifiedContract === x.contractClass)[0]
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

  get allVotes() {
    return [
      {
        contractClass: GenericBinaryVoting,
        title: async a => `${actionFromData(await GenericBinaryVoting.at(a).data.call()).name} voting`,
        description: async a => {
          const data = await GenericBinaryVoting.at(a).data.call()
          const action = actionFromData(data)
          return `${await action.votingDescriptionFor(decode(data))}`
        },
      },
      {
        contractClass: Poll,
        title: async () => Promise.resolve('Poll'),
        description: async a => `Poll question: ${await Poll.at(a).description.call()}`,
      },
    ]
  }
}

export default new VotingWatcher()
