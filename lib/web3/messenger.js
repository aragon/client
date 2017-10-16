import uuid from 'uuid'
import Debug from 'debug'
import SimplePostMessage from '../post-message'

const debug = Debug('aragon:messenger')

class Messenger {
  constructor () {
    this.parentRef = window.parent.window
    this.toParent = new SimplePostMessage(this.parentRef, '*', (...args) => this.onResponse(...args))
    this.callbacks = {}
  }

  onResponse (d, srcWin) {
    if (!d) return

    const { reqId, error, data } = d

    if (reqId === 'clear') {
      delete this.callbacks
      this.callbacks = {}
      return
    }

    if (!reqId) {
      debug('Ignoring foriegn data', d)
      return
    }

    this.executeResponse(reqId, error, data)
  }

  executeResponse (reqId, err, data) {
    const cb = this.callbacks[reqId]
    if (cb) cb(err, data)
    else debug('miss', reqId, err, data)
  }

  sendRequest (method, data, cb) {
    const reqId = uuid.v4()

    this.callbacks[reqId] = cb

    debug(`request:${reqId}`, method, data)

    this.toParent.send({ reqId, method, data })
  }
}

export {
  Messenger
}
