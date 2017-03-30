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
    const networkMultiplayer = localStorage.getItem('network') // hack TODO: Get from etherscan
    return localStorage.getItem(this.lastBlockKey) || (EthBlocks.latest.number - (15000 * networkMultiplayer ))
  }

  get lastBlock() {
    return EthBlocks.latest.number
  }

  set lastWatchedBlock(block) {
    return localStorage.setItem(this.lastBlockKey, block)
  }
}

export default Watcher
