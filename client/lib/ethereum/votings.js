import { Stock, Voting, IssueStockVoting } from './contracts'
import Company from './deployed'
import StockWatcher from './stocks'

const Stocks = StockWatcher.Stocks

const Votings = new Mongo.Collection('votings_collection', { connection: null })
window.Company = Company
window.IssueStockVoting = IssueStockVoting
window.Stock = Stock

class VotingWatcher {
  constructor() {
    this.setupCollections()
    this.getAllVotings()
  }

  setupCollections() {
    this.Votings = Votings
    this.persistentStock = new PersistentMinimongo(this.Votings)
  }

  async getAllVotings() {
    const lastId = await Company.votingIndex.call().then(x => x.toNumber())
    const addressesPromises = _.range(lastId-1).map(id => Company.votings.call(id+1))
    const votingAddresses = await Promise.all(addressesPromises)
    await Promise.all(votingAddresses.map((a, i) => this.getVoting(a, i+1)))

    this.Votings.remove({ address: { $nin: votingAddresses } })
  }

  async getVoting(address, index) {
    await this.updateVoting(address, index)
  }

  async updateVoting(address, index) {
    const voting = Voting.at(address)
    const lastId = await voting.optionsIndex.call().then(x => x.toNumber())
    const optionsPromises = _.range(lastId).map(id => voting.options.call(id))

    window.so = Stock.at(Stocks.findOne().address)
    const closingTime = await Stock.at(Stocks.findOne().address).pollingUntil
                              .call(index).then(x => x.toNumber())

    const supportNeeded = Promise.all([voting.neededSupport.call(), voting.supportBase.call()])
                            .then(([s, b]) => s / b)

    const votingObject = {
      title: voting.title.call(),
      description: voting.description.call(),
      options: Promise.all(optionsPromises),
      closingTime: new Date(closingTime * 1000),
      supportNeeded,
      index,
      address,
    }

    const votingInfo = await Promise.allProperties(votingObject)
    console.log(votingInfo)
    this.Votings.upsert(`s_${address}`, votingInfo)
  }
}

window.VotingWatcher = VotingWatcher

export default new VotingWatcher()

/*
IssueStockVote.new(0, 500, { from: EthAccounts.findOne().address, gas: 450000 }).then(function(x) {console.log(x)})
Company.beginPoll('0xf51ae533da01dd48e0e111071aad2f4aa0fb999f', 1481229765000, { from: EthAccounts.findOne().address, gas: 450000 }).then(function(x) {console.log(x)})
VotingStock.castVote(3, 0, {from: 'xxx'})
*/
