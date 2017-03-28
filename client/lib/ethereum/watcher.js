class Watcher {
  constructor(key) {
    this.key = key
  }

  listen() {
    console.error('Watcher has no listen function')
  }

  watchEvent(_event, callback, predicate = {}) {
    const realCallback = (err, ev) => {
      if (err) return callback.call(this, err)
      this.lastWatchedBlock = ev.blockNumber
      return callback.call(this, err, ev)
    }

    _event(predicate, this.streamingPredicate).watch(realCallback)
    _event(predicate, this.missedPredicate).get((err, evs) => {
      if (err) return realCallback(err)
      return evs.map(ev => realCallback(err, ev))
    })
  }

  get missedPredicate() {
    return { fromBlock: Math.max(0, this.lastWatchedBlock), toBlock: this.threshold() }
  }

  get streamingPredicate() {
    return { fromBlock: this.threshold(), toBlock: 'latest' }
  }

  threshold() {
    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }

    return this.lastBlock
  }

  get lastBlockKey() {
    return `lB_${this.key}`
  }

  get lastWatchedBlock() {
    return Session.get(this.lastBlockKey) || (EthBlocks.latest.number - 15000 * 40)
  }

  get lastBlock() {
    return EthBlocks.latest.number
  }

  set lastWatchedBlock(block) {
    return Session.setPersistent(this.lastBlockKey, block)
  }
}

export default Watcher
