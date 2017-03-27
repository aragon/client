// @flow
import { EthAccounts } from 'meteor/ethereum:accounts'
import { EthBlocks } from 'meteor/ethereum:blocks'

import Build from '/client/lib/build'
import _BytesHelper from '/imports/lib/contracts/build/contracts/BytesHelper'
import { allContracts, GenericBinaryVoting } from './contracts'
import { domains, names } from './networks'

import { NotificationsManager } from '/client/lib/notifications'

import listeners from './listeners'
import initWatchers from './watchers'

const getNetworkID = () => (
  new Promise((resolve, reject) => {
    web3.version.getNetwork((err, id) => {
      if (err) reject(err)
      else resolve(id)
    })
  })
)

const delay = t => new Promise(r => setTimeout(() => r(), t))

const initCollections = async (): Promise<boolean> => {
  const promises = await Promise.all([
    new Promise(async (resolve, reject) => {
      const accountObserver = EthAccounts.find().observe({
        addedAt: () => {
          console.log('EthAccounts: Ready')
          if (accountObserver) accountObserver.stop()
          resolve(true)
        },
      })
      try {
        EthAccounts.init()
        web3.eth.getAccounts((err, accs) => {
          if (err) return reject(err)
          else if (accs.length < 1) resolve(true)
        })
      } catch (e) {
        reject(e)
      }
    }),
    new Promise(async (resolve, reject) => {
      const blockObserver = EthBlocks.find().observe({
        addedAt: () => {
          console.log('EthBlocks: Ready')
          blockObserver.stop()
          resolve(true)
        },
      })
      try {
        EthBlocks.init()
      } catch (e) {
        reject(e)
      }
    })
  ])

  return promises[0] && promises[1]
}

const initConnection = async (): Promise<boolean> => (
  new Promise((resolve, reject) => {
    let timeout: number = 0
    const retry = () => {
      timeout += timeout+1000
      console.log('EthereumNode: Trying connection in', timeout)
      setTimeout(tryConnection, timeout)
    }
    const tryConnection = () => {
      if (!web3.isConnected()) return retry()

      if (web3.currentProvider.constructor.name === 'MetamaskInpageProvider') return resolve(true)

      web3.eth.getSyncing((e, sync) => {
        if (e || !sync) return resolve(true)

        return retry()
      })
    }
    setTimeout(tryConnection, 100)
  })
)

class EthereumNode {
  static async connect(): Promise<boolean> {
    web3.reset(true)
    const nodeReady = await initConnection()
    let collectionsReady = false
    if (window.isElectron) {
      try {
        setTimeout(() => {
          if (!collectionsReady) {
            console.log('time passed, didnt start')
            return this.connect()
          }
        }, 1000)
        collectionsReady = await initCollections()
      } catch (e) {
        console.log('Caught the exception', e)
        delay(500)
        return this.connect()
      }
    } else {
      collectionsReady = await initCollections()
    }

    console.log(collectionsReady)

    allContracts.forEach(c => c.setProvider(web3.currentProvider))
    const nID = await getNetworkID()

    Session.set('network', nID)
    Session.set('etherscanSub', domains[nID] || '')
    Session.set('networkName', names[nID])

    GenericBinaryVoting.setNetwork(nID)
    GenericBinaryVoting.link('BytesHelper', (_BytesHelper.networks[nID] || _BytesHelper.networks[15] || { address: '0x0' }).address)

    console.log('EthereumNode: ready')
    return nodeReady && collectionsReady
  }

  static async bindListeners() {
    setTimeout(async () => {
      initWatchers()
      const allListeners = await listeners.all()
      NotificationsManager.listen(allListeners)
    }, 1000)
  }
}

export default EthereumNode
