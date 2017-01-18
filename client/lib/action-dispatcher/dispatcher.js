import { GenericBinaryVoting } from '/client/lib/ethereum/contracts'

import ethUtils from 'ethereumjs-util'
import { bylawForAction } from './bylaws'

class Dispatcher {
  get address() {
    return Identity.current(true).ethereumAddress
  }

  get transactionParams() {
    return { from: this.address, gas: 3500000 }
  }

  async dispatch(action, params) {
    const bylaw = bylawForAction(action)
    if (bylaw.type === 0) {
      return await this.createVoting(action.companyFunction, params, action.signature, bylaw.minimumVotingTime)
    }

    return await this.performTransaction(action.companyFunction, params)
  }

  async performTransaction(f, args) {
    return f.sendTransaction.apply(this, args.concat([this.transactionParams]), signature)
  }

  async createVoting(f, args, signature, votingTime) {
    const rawData = f.request.apply(this, args).params[0].data
    const txData = ethUtils.toBuffer(rawData)
    const votingCloses = votingTime + (+new Date() / 1000)

    const voting = await GenericBinaryVoting.new(signature, txData, this.transactionParams)
    await voting.setTxid(voting.transactionHash, this.transactionParams)
    return await Company.beginPoll(voting.address, votingCloses, this.transactionParams)
  }
}

DD = Dispatcher

export default Dispatcher
