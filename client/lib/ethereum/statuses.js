import { Entities } from '/client/lib/identity'
import Company from './deployed'

class StatusWatcher {
  constructor() {
    this.listenForStatusChanges()
  }

  listenForStatusChanges() {
    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: this.lastWatchedBlock + 1, toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    Company.EntityNewStatus({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchStatus(err, ev)))
    Company.EntityNewStatus({}, streamingPredicate).watch((err, ev) => this.watchStatus(err, ev))
  }

  async watchStatus(err, ev) {
    if (!err && ev.args) await this.updateStatus(ev.args.entity, ev.args.status)
    this.lastWatchedBlock = ev.blockNumber
  }

  async updateStatus(ethereumAddress, _status) {
    const status: number = _status.toNumber()
    Entities.upsert({ ethereumAddress }, { $set: { status } })
  }

  get lastBlockKey() {
    return 'lB_st'
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

export default new StatusWatcher()
