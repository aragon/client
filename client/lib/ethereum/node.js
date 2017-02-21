// @flow
import { EthAccounts } from 'meteor/ethereum:accounts'
import { EthBlocks } from 'meteor/ethereum:blocks'

import Build from '/client/lib/build'
import _BytesHelper from '/imports/lib/contracts/build/contracts/BytesHelper'
import { allContracts, GenericBinaryVoting } from './contracts'
import { getDeployedAddress } from './deployed'

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

const initCollections = async (): Promise<boolean> => {
  const promises = await Promise.all([
    new Promise((resolve, reject) => {
      const accountObserver = EthAccounts.find().observe({
        addedAt: () => {
          console.log('EthAccounts: Ready')
          if (accountObserver) accountObserver.stop()
          resolve(true)
        },
      })
      EthAccounts.init()
    }),
    new Promise((resolve, reject) => {
      const blockObserver = EthBlocks.find().observe({
        addedAt: () => {
          console.log('EthBlocks: Ready')
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
    const nodeReady = await initConnection()
    const collectionsReady = await initCollections()

    allContracts.forEach(c => c.setProvider(web3.currentProvider))
    const nID = await getNetworkID()
    GenericBinaryVoting.setNetwork(nID)
    GenericBinaryVoting.link('BytesHelper', _BytesHelper.networks[nID].address)

    if (Build.Settings.get('landingNode')) {
      await deployNewCompany()
    }

    await getDeployedAddress()

    initWatchers()

    console.log('EthereumNode: ready')
    return nodeReady && collectionsReady
  }

  static async bindListeners() {
    const allListeners = await listeners.all()
    NotificationsManager.listen(allListeners)
  }
}

export default EthereumNode
