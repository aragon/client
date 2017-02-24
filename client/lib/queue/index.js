// @flow
import { ReactiveVar } from 'meteor/reactive-var'

import { actionFromData, decode } from '../action-dispatcher/decoder'

class TxQueue {
  queue = ReactiveVar([])

  init() {
    web3.eth.filter('pending', (err, txID) => {
      if (err) return
      web3.eth.getTransaction(txID, (err, tx) => {
        const action = actionFromData(tx.input)
        console.log(action)
        if (!action) return
        action.txID = txID
        this.add(action)
      })
    })

    web3.eth.filter('latest', (err, txID) => {
      if (err) return
      console.log('Saw', txID)
      this.remove(txID)
    })
  }
  add(tx) {
    this.queue.set(this.queue.get().concat(tx))
  }
  remove(txID) {
    const newArr = this.queue.get()
    this.queue.set(this.queue.get().filter((tx) => (
      tx.txID !== txID
    )))
  }
  resolve(txId) {

  }
}

export default new TxQueue()
