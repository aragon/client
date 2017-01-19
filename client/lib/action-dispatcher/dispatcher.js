import Company from '/client/lib/ethereum/deployed'
import { GenericBinaryVoting } from '/client/lib/ethereum/contracts'
import Identity from '/client/lib/identity'

import { bylawForAction } from './bylaws'
import actions from './actions'

class Dispatcher {
  get address() {
    return Identity.current(true).ethereumAddress
  }

  get transactionParams() {
    return { from: this.address, gas: 3500000 }
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

  async createVoting(f, args, signature, votingTime) {
    const txData = f.request.apply(this, args).params[0].data
    const votingCloses = votingTime + Math.floor(+new Date() / 1000)

    const voting = await GenericBinaryVoting.new(signature, txData, this.transactionParams)
    await voting.setTxid(voting.transactionHash, this.transactionParams)

    return await this.dispatch(actions.beginPoll, voting.address, votingCloses)
  }
}

export default new Dispatcher()
