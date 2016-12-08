// import { BinaryVote } from './contracts'
// import Company from './deployed'

const Votes = new Mongo.Collection('votes_collection', { connection: null })

class VoteWatcher {
  constructor() {
    this.setupCollections()
  }

  setupCollections() {
    this.Votes = Votes
    this.persistentStock = new PersistentMinimongo(this.Votes)
  }
}

export default new VoteWatcher()
