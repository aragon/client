// @flow
import { ReactiveVar } from 'meteor/reactive-var'

import { actionFromData, decode } from '../action-dispatcher/decoder'

const getTx = txid => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(txid, (err, tx) => {
      if (err) reject(err)
      resolve(tx)
    })
  })
}

const getBlock = blockHash => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(blockHash, (err, block) => {
      if (err) reject(err)
      resolve(block)
    })
  })
}

class TxQueue {
  queue = ReactiveVar([])
  listeners = {}

  init() {
    web3.eth.filter('latest', async (err, blockHash) => {
      if (err) return
      const block = await getBlock(blockHash)
      block.transactions.forEach(this.remove.bind(this))
    })
  }

  async add(txID) {
    const tx = await getTx(txID)
    const action = actionFromData(tx.input)

    if (!action) return
    action.txID = txID

    this.queue.set(this.queue.get().concat(action))
  }

  async addListener(txID, callback) {
    this.listeners[txID] = callback
  }

  remove(txID) {
    const newArr = this.queue.get()
    this.queue.set(this.queue.get().filter((tx) => (
      tx.txID !== txID
    )))
    if (this.listeners[txID]) {
      this.listeners[txID]()
      delete this.listeners[txID]
    }
  }
}

export default new TxQueue()
