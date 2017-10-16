import { inherits } from 'util'
import Debug from 'debug'
import HookedWalletProvider from 'web3-provider-engine/subproviders/hooked-wallet'

inherits(WalletProvider, HookedWalletProvider)

const debug = Debug('aragon:wallet-provider')

function WalletProvider ({ messenger }) {
  if (!messenger) throw new Error('Configure WalletProvider properly')

  let accountsCache
  let accountsCallbacklog = []

  const self = this
  const opts = {}

  opts.getAccounts = function (cb) {
    debug('getAccounts')

    if (accountsCache) {
      cb(null, accountsCache)
    } else {
      messenger.sendRequest('getAddresses', null, (err, accounts) => {
        if (err) {
          cb(err)
          return
        }

        accountsCache = accounts

        window.web3.eth.defaultAccount = accounts[0]

        cb(null, accounts)
      })
    }
  }

  opts.approveTransaction = function (txParams, cb) {
    debug('approveTransaction')

    messenger.sendRequest('approveTransaction', txParams, cb)
  }

  opts.approveMessage = function (msgParams, cb) {
    debug('approveMessage')

    messenger.sendRequest('approveMessage', msgParams, cb)
  }

  self.signTransaction = function (txData, cb) {
    debug('signTransaction')

    messenger.sendRequest('signTransaction', txData, cb)
  }

  self.signMessage = function (msgParams, cb) {
    debug('signMessage')

    messenger.sendRequest('signMessage', msgParams, cb)
  }

  self.signPersonalMessage = function (msgParams, cb) {
    debug('signPersonalMessage')

    messenger.sendRequest('signPersonalMessage', msgParams, cb)
  }

  WalletProvider.super_.call(self, opts)
}

export {
  WalletProvider
}
