import { actionFromData, decode } from '/client/lib/action-dispatcher/decoder'

import Watcher from './watcher'

import { Stock, Voting, GenericBinaryVoting, Poll } from './contracts'
import { Company } from './deployed'
import StockWatcher from './stocks'
import { verifyContractCode } from './verify'

const Stocks = StockWatcher.Stocks
const Votings = new Mongo.Collection('votings', { connection: null })

class VotingWatcher extends Watcher {
  constructor() {
    super('v')
    this.setupCollections()
  }

  listen() {
    this.listenForUpdates()
  }

  setupCollections() {
    this.Votings = Votings
    this.persistentVotings = new PersistentMinimongo(this.Votings)
  }

  listenForUpdates() {
    const self = this
    console.log('listen votings')

    const watch = async (err, ev) => {
      console.log('voting event', ev)
      self.getVoting(ev.args.votingAddress, ev.args.id.toNumber())
    }

    const watchBylaw = (err, ev) => {
      const affectedVotings = Votings.find({ mainSignature: ev.args.functionSignature, voteExecuted: null, closingTime: { $gt: +new Date() } })
      affectedVotings.forEach(v => self.getVoting(v.address, v.index))
    }

    this.watchEvent(Company().VoteExecuted, watch)
    this.watchEvent(Company().NewVoting, watch)
    this.watchEvent(Company().VoteCasted, watch)

    this.watchEvent(Company().BylawChanged, watchBylaw)
  }

  async getVoting(address, index) {
    await this.updateVoting(address, index)
  }

  async countVotes(index, optionId) {
    const counted = await Company().countVotes.call(index, optionId)
    const votes = counted[0].toNumber()
    return { votes, relativeVotes: votes / counted[1].toNumber(), absoluteVotes: votes / counted[2].toNumber() }
  }

  async updateVoting(address, index) {
    console.log('getting voting', address, index)

    const company = Company()
    const info = await Company().getVotingInfo(index)
    const [vad, startTime, closingTime, isExecuted, executed, voteClosed] = info

    const voting = Voting.at(address)
    const lastId = await voting.optionsIndex.call().then(x => x.toNumber())
    const ids = _.range(lastId)
    const optionsPromises = ids.map(id => voting.options.call(id))
    const votes = ids.map(id => this.countVotes(index, id))

    const votingSupport = voting.votingSupport.call(Company().address)

    const supportNeeded = votingSupport.then(([s, b]) => s / b)
    const relativeMajorityOnClose = votingSupport.then(([s, b, r]) => r)

    const voteExecuted = isExecuted ? executed.toNumber() : null

    const verifiedContract = await this.verifyVote(address)
    if (!verifiedContract) {
      return console.error('Unknown voting')
    }

    const description = await verifiedContract.description(address)
    const entities = description.split(' ').filter(web3.isAddress)

    const votingObject = {
      title: verifiedContract.title(address),
      options: Promise.all(optionsPromises),
      startTime: +new Date(startTime.toNumber() * 1000),
      closingTime: +new Date(closingTime.toNumber() * 1000),
      voteCounts: Promise.all(votes),
      creator: voting.creator.call(),
      mainSignature: voting.mainSignature.call(),

      entities,
      description,
      voteExecuted,
      voteClosed,
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

    if (!verifiedContract) { return this.allVotes[0] } // TODO: Solve problem where someone makes contract with GBV interface but different logic
    return this.allVotes.filter(x => verifiedContract === x.contractClass)[0]
  }

  get allVotes() {
    return [
      {
        // Dear future developer, some day there might be a problem verifying because it is not linked to BytesHelper
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
