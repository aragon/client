import helpers from '/client/helpers'
import Identity from '/client/lib/identity'

import { Stock, Voting, Poll, IssueStockVoting, GrantVestedStockVoting, StockSaleVoting } from './contracts'
import Company from './deployed'
import StockWatcher from './stocks'

const timeRange = helpers.timeRange

const Stocks = StockWatcher.Stocks
const Votings = new Mongo.Collection('votings', { connection: null })

class VotingWatcher {
  constructor() {
    this.setupCollections()
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

    const supportNeeded = Promise.all([voting.neededSupport.call(), voting.supportBase.call()])
                            .then(([s, b]) => s / b)
    const voteExecuted = Company.voteExecuted.call(index)
                            .then(x => Promise.resolve(x.toNumber()))
                            .then(x => (x > 0 ? x - 10 : null))

    const contractClass = await this.verifyVote(address)
    const votingStrings = this.allVotes.filter(x => contractClass === x.contractClass)[0]

    const votingObject = {
      title: votingStrings.title(address),
      description: votingStrings.description(address),
      options: Promise.all(optionsPromises),
      closingTime: +new Date(closingTime * 1000),
      voteCounts: Promise.all(votes),
      voteExecuted,
      supportNeeded,
      index,
      address,
    }

    const votingInfo = await Promise.allProperties(votingObject)

    this.Votings.upsert({ _id: `v_${address}` }, votingInfo)
  }

  // Returns vote type
  async verifyVote(address) {
    const contract = Voting.at(address)

    const txid = await contract.txid.call()
    if (!txid) { return null }

    if (contract.address !== web3.eth.getTransactionReceipt(txid).contractAddress) {
      return null
    }

    const bytecode = web3.eth.getTransaction(txid).input

    for (const c of this.knownContracts) {
      if (bytecode.indexOf(c.binary) === 0) { // Account for constructor values at end of input
        return c
      }
    }

    return null
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
        contractClass: Poll,
        title: async () => Promise.resolve('Poll'),
        description: async a => `Poll question: ${await Poll.at(a).title.call()}`,
      },
      {
        contractClass: IssueStockVoting,
        title: async () => Promise.resolve('Issue Stock'),
        description: async a => {
          const c = IssueStockVoting.at(a)
          const amount = await c.amount.call().then(x => x.toNumber())
          const stock = Stocks.findOne({ index: (await c.stock.call().then(x => x.toNumber())) }).symbol
          return `Issue ${amount} ${stock} shares`
        },
      },
      {
        contractClass: GrantVestedStockVoting,
        title: async () => Promise.resolve('Grant Stock'),
        description: async a => {
          const c = GrantVestedStockVoting.at(a)
          const amount = await c.amount.call().then(x => x.toNumber())
          const stock = Stocks.findOne({ index: (await c.stock.call().then(x => x.toNumber())) }).symbol
          const to = await c.recipient.call()
          const vesting = await c.vesting.call().then(x => moment(x.toNumber() * 1000))
          const cliff = await c.cliff.call().then(x => moment(x.toNumber() * 1000))
          const now = moment()
          return `Grant ${amount} ${stock} shares to ${to} with ${timeRange(now, cliff)} cliff and ${timeRange(now, vesting)} vesting`
        },
      },
      {
        contractClass: StockSaleVoting,
        title: async a => `${await StockSaleVoting.at(a).title.call()} voting`,
        description: async a => `${await StockSaleVoting.at(a).title.call()} voting`,
      },
    ]
  }

  get knownContracts() {
    return this.allVotes.map(x => x.contractClass)
  }
}

window.VotingWatcher = VotingWatcher

export default new VotingWatcher()
