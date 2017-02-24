import utils from 'ethereumjs-util'

import Company from './deployed'
import Watcher from './watcher'

Bylaws = new Mongo.Collection('bylaws', { connection: null })

class BylawsWatcher extends Watcher {
  constructor() {
    super('byl')
    this.setupCollections()
  }

  listen() {
    this.watchEvent(Company().BylawChanged, this.watchBylaw)
  }

  setupCollections() {
    this.Bylaws = Bylaws
    this.persistentBylaws = new PersistentMinimongo(this.Bylaws)
  }

  async watchBylaw(err, ev) {
    if (!err && ev.args) await this.updateBylaw(ev.args.functionSignature)
  }

  async updateBylaw(signature) {
    const [type, updated, updatedBy] = await Company().getBylawType(signature)
        .then(x => x.map(y => ((y.toNumber) ? y.toNumber() : y)))
    let details = Promise.resolve()
    if (type === 0) {
      details = Company().getVotingBylaw.call(signature)
        .then(x => x.map(y => ((y.toNumber) ? y.toNumber() : y)))
        .then(([supportNeeded, supportBase, closingRelativeMajority, minimumVotingTime]) =>
          ({ supportNeeded, supportBase, closingRelativeMajority, minimumVotingTime }))
    } else {
      details = Company().getStatusBylaw.call(signature)
        .then(x => x.toNumber())
        .then(neededStatus => ({ neededStatus }))
    }

    const bylawObject = await Promise.allProperties({
      signature,
      type,
      details,
      updatedBy,

      updated: new Date(updated * 1000),
    })

    const signatureHash = utils.bufferToHex(utils.sha3(signature))

    this.Bylaws.upsert({ _id: `byl_${signatureHash}` }, bylawObject)
  }
}

export default new BylawsWatcher()
