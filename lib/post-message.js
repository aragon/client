/* global define */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.SimplePostMessage = factory()
  }
}(this, function () {
  return function SimplePostMessage (target, targetOrigin, receiveCallBack) {
    var receive

    if (!(this instanceof SimplePostMessage)) {
      return new SimplePostMessage(target, targetOrigin, receiveCallBack)
    }

    if (!target || !targetOrigin) throw new Error('Params target and targetOrigin are required!')

    this.send = function (message, transfer) {
      target.postMessage(message, targetOrigin, transfer)
    }

    this.removeListener = function () {
      if (receive) window.removeEventListener('message', receive)
    }

    if (receiveCallBack) {
      receive = function (event) {
        receiveCallBack(event.data, event.source)
      }
      window.addEventListener('message', receive)
    }
  }
}))
