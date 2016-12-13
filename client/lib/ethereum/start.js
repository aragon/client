import { NotificationsManager } from '/client/lib/notifications'

import web3 from './web3'
import listeners from './listeners'

if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1')
  Meteor.disconnect()

connectToNode = () => {
  console.time('startNode')
  console.log('Connect to node...')

  EthAccounts.init()
  EthBlocks.init()

  setTimeout(() => {
    NotificationsManager.listen(listeners.all())
  }, 100) // Somehow EthBlocks doesnt have blocks loaded right away

  console.timeEnd('startNode')
}

// Stop app operation, when the node is syncing
web3.eth.isSyncing((error, syncing) => {
  if (!error) {
    if (syncing === true) {
      console.time('nodeRestarted')
      console.log('Node started syncing, stopping app operation')
      web3.reset(true)

    } else if (_.isObject(syncing)) {
      syncing.progress = Math.floor(((syncing.currentBlock - syncing.startingBlock) / (syncing.highestBlock - syncing.startingBlock)) * 100)
      syncing.blockDiff = numeral(syncing.highestBlock - syncing.currentBlock).format('0,0')

      TemplateVar.setTo('header nav', 'syncing', syncing)

    } else {
      console.timeEnd('nodeRestarted')
      console.log('Restart app operation again')

      TemplateVar.setTo('header nav', 'syncing', false)
      connectToNode()
    }
  }
})


const connect = () => {
  if (web3.isConnected()) {
    // only start app operation, when the node is not syncing (or the eth_syncing property doesn't exists)
    web3.eth.getSyncing(function(e, sync) {
      if(e || !sync)
      connectToNode()
    })

  } else {
    // make sure the modal is rendered after all routes are executed
    Meteor.setTimeout(function(){
      // if in mist, tell to start geth, otherwise start with RPC
      var gethRPC = (web3.admin) ? 'geth' : 'geth --rpc --rpccorsdomain "'+window.location.protocol + '//' + window.location.host+'"'

      EthElements.Modal.question({
        text: new Spacebars.SafeString(TAPi18n.__('wallet.app.texts.connectionError' + (web3.admin ? 'Mist' : 'Browser'),
        {node: gethRPC})),
        ok: function(){
          Tracker.afterFlush(function(){
            connect()
          })
        }
      }, {
        closeable: false
      })

    }, 600)
  }
}

Meteor.startup(() => {
  Meteor.setTimeout(() => {
    connect()
  }, 3000)
})
