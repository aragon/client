import { inherits } from 'util'
import Debug from 'debug'
import SubProvider from 'web3-provider-engine/subproviders/subprovider'

const debug = Debug('aragon:rpc-provider')

inherits(RpcProvider, SubProvider)

function RpcProvider ({ messenger }) {
  if (!messenger) throw new Error('Configure RpcProvider properly')

  this.messenger = messenger
}

const handle = (payload, cb) => (...args) => {
  try {
    cb(...args)
  } catch (e) {
    console.log(e)
  }
}

RpcProvider.prototype.handleRequest = function (payload, next, end) {
  this.messenger.sendRequest('rpc', payload, handle(payload, end))
}

export {
  RpcProvider
}
