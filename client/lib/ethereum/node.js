// @flow
import { EthAccounts } from 'meteor/ethereum:accounts'
import { EthBlocks } from 'meteor/ethereum:blocks'

import { NotificationsManager } from '/client/lib/notifications'

import web3 from './web3'
import listeners from './listeners'

const initCollections = async (): Promise<boolean> => {
  const promises = await Promise.all([
    new Promise((resolve, reject) => {
      const accountObserver = EthAccounts.find().observe({
        addedAt: () => {
          console.log('EthAccounts is ready')
          if (accountObserver) accountObserver.stop()
          resolve(true)
        },
      })
      EthAccounts.init()
    }),
    new Promise((resolve, reject) => {
      const blockObserver = EthBlocks.find().observe({
        addedAt: () => {
          console.log('EthBlocks is ready')
          blockObserver.stop()
          resolve(true)
        },
      })
      EthBlocks.init()
    })
  ])

  return promises[0] && promises[1]
}

const initConnection = async (): Promise<boolean> => (
  new Promise((resolve, reject) => {
    let timeout: number = 1
    const retry = () => {
      timeout += timeout*10
      console.log('trying in', timeout)
      tryConnection(resolve, reject, timeout)
    }
    const tryConnection = () => {
      if (!web3.isConnected()) return retry()

      web3.eth.getSyncing((e, sync) => {
        if (e || !sync) return resolve(true)

        return retry()
      })
    }
    setTimeout(tryConnection, timeout)
  })
)

class EthereumNode {
  static async connect(): Promise<boolean> {
    const promises = await Promise.all([initConnection(), initCollections()])
    console.log('EthereumNode is ready')
    return promises[0] && promises[1]
  }

  static async bindListeners() {
    const allListeners = await listeners.all()
    NotificationsManager.listen(allListeners)
  }
}

export default EthereumNode
