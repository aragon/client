// @flow
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

import TxQueue from '/client/lib/queue'

window.TxQueue = TxQueue

const tmpl = Template.Layout_PendingTx

tmpl.onRendered(() => {
  $('#pendingTxButton').popup({
    inline: true,
    on: 'click',
    position: 'bottom center',
  })
})

tmpl.helpers({
  txs: () => TxQueue.queue.get(),
})
