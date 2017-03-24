// @flow
import { ReactiveVar } from 'meteor/reactive-var'

import { actionFromData } from '../action-dispatcher/decoder'

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
  onEmpty = Function

  init() {
    web3.eth.filter('latest', async (err, blockHash) => {
      if (err) return
      const block = await getBlock(blockHash)
      block.transactions.forEach(this.remove.bind(this))
    })
  }

  async add(txID: string) {
    console.log('Queuing', txID)
    const tx = await getTx(txID)
    if (!tx) {
      alert('Couldnt find transaction in pending transaction to add to queue. Most likely our web3 provider (Infura) isnt working properly.')
    }
    const action = actionFromData(tx.input)

    if (!action) return
    action.txID = txID

    this.queue.set(this.queue.get().concat(action))
  }

  async addListener(txID: string, callback: Function) {
    this.listeners[txID] = callback
  }

  remove(txID: string) {
    const newArr = this.queue.get().filter((tx) => (
      tx.txID !== txID
    ))
    if (newArr.length === 0 && this.onEmpty) this.onEmpty()

    setTimeout(() => (this.queue.set(newArr)), 500)

    if (this.listeners[txID]) {
      this.listeners[txID]()
      delete this.listeners[txID]
    }
  }
}

export default new TxQueue()
