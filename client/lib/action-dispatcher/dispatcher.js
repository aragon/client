// @flow
import { GenericBinaryVoting } from '/client/lib/ethereum/contracts'
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

  async createVoting(f: Function, args: Array<mixed>, signature: string, votingTime: number) {
    const txData = f.request.apply(this, args).params[0].data
    const votingCloses = votingTime + Math.floor(+new Date() / 1000)

    const voting = await GenericBinaryVoting.new(txData, this.transactionParams)
    await voting.setTxid(voting.transactionHash, this.transactionParams)

    const votesOnCreate = true
    const executesOnDecided = false

    return await this.performTransaction(actions.beginPoll.companyFunction, [voting.address, votingCloses, votesOnCreate, executesOnDecided])
  }
}

export default new Dispatcher()
