// @flow
import { GenericBinaryVoting } from '/client/lib/ethereum/contracts'
import { Company } from '/client/lib/ethereum/deployed'
import { personalSign, toHex } from '/client/lib/ethereum/sign'
import utils from 'ethereumjs-util'

// import Identity from '/client/lib/identity'

import Queue from '/client/lib/queue'

import { bylawForAction } from './bylaws'
import actions from './actions'

const gasEstimate = p => {
  return new Promise((resolve, reject) => {
    web3.eth.estimateGas(p, (err, gas) => resolve(err ? -1 : gas))
  })
}

const sendTransaction = p => {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(p, (err, txid) => {
      if (err) return reject(err)
      resolve(txid)
    })
  })
}

const promisedDeploy = (c, p) => {
  let counter = 0 // Counter needed because contract deploy returns twice, one with txhash and later w txhash & address
  return new Promise((resolve, reject) => {
    c.new.apply(c, p.concat([(err, x) => {
      if (counter > 0) return 0
      if (err) return reject(err)
      counter += 1
      resolve(x.transactionHash)
    }]))
  })
}

const toggleMetaMask = (show: boolean = true) => {
  const metaMask = $('#Layout_MetaMask')
  const toggleClass = (show) ? 'hidden' : 'visible'
  if (metaMask.hasClass(toggleClass)) {
    metaMask.transition('fade down')
  }
}

class Dispatcher {
  get transactionParams() {
    return { from: Entities.findOne({current: true}).ethereumAddress } // dependency cycle :(
  }

  async dispatch(action, ...params) {
    const bylaw = bylawForAction(action)
    if (bylaw && bylaw.type === 0 && bylaw.details.supportBase !== 0) {
      return await this.createVoting(action.companyFunction, params,
                                      action.signature, bylaw.details.minimumVotingTime)
    }

    return await this.performTransaction.apply(this, [action.companyFunction].concat(params))
  }

  async performTransaction(f, ...args) {
    const [ params ] = f.request.apply(this, args.concat([this.transactionParams])).params

    console.log('sending tx', params)
    let txID = ''
    try {
      txID = await sendTransaction(params)
    } catch (e) {
      return alert('Transaction failed. If you believe this to be an error, contact support', e)
    }

    await this.addPendingTransaction(txID)

    if (!this.dontHideMetamask) toggleMetaMask(false)

    return txID
  }

  async signPayload(payload: string) {
    const signature = await personalSign(this.transactionParams.from, payload)
    const r = signature.slice(0, 66)
    const s = `0x${signature.slice(66, 130)}`
    const v = `0x${signature.slice(130, 132)}` // Assumes v = { 27, 28 }
    return { r, s, v }
  }

  async deployContract(contract, ...args) {
    const params = this.transactionParams
    params.data = contract.binary

    const txID = await promisedDeploy(web3.eth.contract(contract.abi), args.concat([params]))
    await this.addPendingTransaction(txID)
    if (!this.dontHideMetamask) toggleMetaMask(false)
    return txID
  }

  async addPendingTransaction(txID: String) {
    await Queue.add(txID)
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
    const payload = await company.hashedPayload(company.address, nonce)
    const preauth = Buffer.concat([new Buffer('Voting pre-auth '), utils.toBuffer(payload)])
    const { r, s, v } = await this.signPayload(utils.bufferToHex(preauth))

    const txid = await this.deployContract(GenericBinaryVoting, txData, votingCloses, company.address, r, s, v, nonce)
    console.log('deployed on tx', txid)
  }
}

export default new Dispatcher()
