// @flow
import { GenericBinaryVoting } from '/client/lib/ethereum/contracts'
import Company from '/client/lib/ethereum/deployed'

import Identity from '/client/lib/identity'

import { bylawForAction } from './bylaws'
import actions from './actions'

class Dispatcher {
  get address() {
    return Identity.current(true).ethereumAddress
  }

  get transactionParams() {
    return { from: this.address }
  }

  async dispatch(action, ...params) {
    const bylaw = bylawForAction(action)
    if (bylaw.type === 0) {
      return await this.createVoting(action.companyFunction, params,
                                      action.signature, bylaw.details.minimumVotingTime)
    }

    return await this.performTransaction(action.companyFunction, params)
  }

  async performTransaction(f, args) {
    return f.sendTransaction.apply(this, args.concat([this.transactionParams]))
  }

  async signPayload(payload: string) {
    return await new Promise((resolve, reject) => {
      web3.eth.sign(this.address, payload, (e, signature) => {
        if (e) return reject(e)

        const r = signature.slice(0, 66)
        const s = `0x${signature.slice(66, 130)}`
        const v = `0x${signature.slice(130, 132)}` // Assumes v = { 27, 28 }
        resolve({ r, s, v })
      })
    })
  }

  async createVoting(f: Function, args: Array<mixed>, signature: string, votingTime: number) {
    const txData = f.request.apply(this, args).params[0].data
    const votingCloses = votingTime + Math.floor(+new Date() / 1000)

    const company = Company()
    /*
    // TODO: This needs to be used again
    const votesOnCreate = true
    const executesOnDecided = false
    */

    const nonce = parseInt(Math.random() * 1e15)
    const payload = await company.sigPayload(nonce)
    const { r, s, v } = await this.signPayload(payload)

    console.log(txData, votingCloses, company.address, nonce, payload, r, s, v)

    return await GenericBinaryVoting.new(txData, votingCloses, company.address, r, s, v, nonce, this.transactionParams)
  }
}

export default new Dispatcher()
