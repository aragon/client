/* global fetch */

import 'whatwg-fetch'
import Debug from 'debug'
import Promise from 'bluebird'
import promiseToCallback from 'promise-to-callback'
import JsonRpcError from 'json-rpc-error'
import createPayload from 'web3-provider-engine/util/create-payload'
import EthTx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'

import SimplePostMessage from '../post-message'
import { decrypt } from '../util'
import { Emitter } from './emitter'

const { toBuffer } = ethUtil
const debug = Debug('aragon:service')

class Service {
  constructor ({ slug, serviceUrl, defaultRpcUrl, iframeWindowRef }) {
    if (!slug || !serviceUrl || !iframeWindowRef || !defaultRpcUrl) throw new Error('Configure service properly')

    this.blocked = false
    this.emitter = new Emitter('service')
    this.slug = slug
    this.rpcUrl = defaultRpcUrl
    this.serviceUrl = serviceUrl
    this.toIframe = new SimplePostMessage(iframeWindowRef, '*', (...args) => this.onRequest(...args))
    this.user = {}
  }

  clear () {
    this.toIframe.send({ reqId: 'clear' })
  }

  onRequest (d, srcWin) {
    if (!d) return

    const { reqId, method, data } = d

    if (!reqId) {
      debug('Ignoring foriegn data', d)
      return
    }

    debug(`from-messenger:${method}`, reqId, method, data)

    if (Service.isAllowed(method)) {
      this.executeRequest(reqId, method, data)
    } else {
      this.toIframe.send({
        reqId,
        error: `${method} method isn't allowed`
      })
    }
  }

  executeRequest (reqId, method, d) {
    const fn = this[method]

    debug(`execute:${reqId}`, method, d, error, data)

    fn.call(this, d, (error, data) => {
      try {
        this.toIframe.send({ reqId, error, data })
      } catch (error) {
        debug(error)
        this.toIframe.send({ reqId, error: 'Something went wrong :/' })
      }
    })
  }

  request (method, data) {
    const slug = this.slug

    if (typeof data !== 'object') {
      debug(data)
      return Promise.reject(new Error('Data should be an object'))
    }

    return fetch(this.serviceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug, method, data })
    })
    .then((response) => response.json())
  }

  requestOTP (type, params) {
    debug('requestOTP')

    return this.request('otp_request', { type, params })
  }

  verifyOTPAndGetEncryptedPrivateKey (otp) {
    debug('verifyOTPAndGetEncryptedPrivateKey')

    return this.request('otp_verify', { otp, encryptedPrivateKey: true })
  }

  verifyOTPAndGetAccounts (otp) {
    debug('verifyOTPAndGetAccounts')

    return this.request('otp_verify', { otp, accounts: true })
  }

  decryptAndSetPrivateKey (data, password) {
    debug('decryptAndSetPrivateKey')

    return decrypt(data._encryptedPrivateKey, password)
    .then((privateKey) => {
      debug('privateKey:ready')

      this.user._privateKey = toBuffer(privateKey)
    })
    .finally(() => delete data._encryptedPrivateKeydata)
  }

  secretsHandler (otp, password) {
    this
    .verifyOTPAndGetEncryptedPrivateKey(otp)
    .then(({ success, data }) => {
      if (success) {
        return this
        .decryptAndSetPrivateKey(data, password)
        .then(() => this.emitter.emit('private-key-ready'))
        .catch((error) => {
          debug(error)
          this.emitter.emit('secrets-invalid', 'password')
        })
      } else {
        this.emitter.emit('secrets-invalid', 'otp')
      }
    })
    .catch((err) => this.handleError(err))
  }

  accountsHandler (otp) {
    this
    .verifyOTPAndGetAccounts(otp)
    .then(({ success, data }) => {
      if (success) {
        this.user._accounts = data._accounts
        this.emitter.emit('addresses-ready')
      } else {
        this.emitter.emit('addresses-otp-invalid')
      }
    })
    .catch((err) => this.handleError(err))
  }

  handleApproval (type, params, cb) {
    this.emitter.emit('modal-open', type, params)

    return this.requestOTP(type, params)
    .then((success) => {
      this.emitter.emit('otp-sent', success)

      if (success) {
        if (type === 'accounts') {
          this.emitter.once('addresses-otp-enter', (...args) => this.accountsHandler(...args))
        } else {
          this.emitter.once('secrets-enter', (...args) => this.secretsHandler(...args))
        }

        this.emitter.once('approved', (approved) => cb(null, approved))
      } else {
        return Promise.reject(new Error('Error in sending OTP'))
      }
    })
    .catch((err) => this.handleError(err, false, cb))
  }

  handleError (err, data, cb) {
    debug(err, data)
    this.emitter.emit('error', err)

    if (cb) cb(err, data)
  }

  approveTransaction (txParams, cb) {
    debug('approveTransaction')

    this.handleApproval('transaction', txParams, cb)
  }

  approveMessage (msgParams, cb) {
    debug('approveMessage')

    this.handleApproval('message', msgParams, cb)
  }

  getPrivateKey (address, cb) {
    debug('getPrivateKey')

    if (!this.user._privateKey) {
      cb('Private key missing for requested address')
      return
    }

    debug(this.user._privateKey)

    const privateKey = this.user._privateKey
    delete this.user._privateKey

    cb(null, privateKey)
  }

  getAddresses (_, cb) {
    this.handleApproval('accounts', null, (err, success) => {
      if (err) {
        cb(err)
        return
      }

      if (success) {
        cb(null, this.user._accounts)
      } else {
        cb('User rejected proposal')
      }
    })
  }

  signTransaction (txData, cb) {
    if (txData.gas !== undefined) txData.gasLimit = txData.gas
    txData.value = txData.value || '0x00'
    txData.data = ethUtil.addHexPrefix(txData.data)

    this.getPrivateKey(txData.from, function (err, privateKey) {
      if (err) return cb(err)

      const tx = new EthTx(txData)
      tx.sign(privateKey)
      cb(null, '0x' + tx.serialize().toString('hex'))
    })
  }

  signMessage (msgParams, cb) {
    this.getPrivateKey(msgParams.from, function (err, privateKey) {
      if (err) return cb(err)
      const buffer = ethUtil.toBuffer(msgParams.data)
      const sig = ethUtil.ecsign(buffer, privateKey)
      const serialized = ethUtil.bufferToHex(Service.concatSignature(sig.v, sig.r, sig.s))
      cb(null, serialized)
    })
  }

  signPersonalMessage (msgParams, cb) {
    this.getPrivateKey(msgParams.from, function (err, privateKey) {
      if (err) return cb(err)
      const serialized = sigUtil.personalSign(privateKey, msgParams)
      cb(null, serialized)
    })
  }

  rpc (payload, cb) {
    // overwrite id to conflict with other concurrent users
    const newPayload = createPayload(payload)
    let res, err

    promiseToCallback(
      fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPayload)
      }).then(function (_res) {
        res = _res

        switch (res.status) {
          case 504:
            const msg = 'Gateway timeout. The request took too long to process. This can happen when querying logs over too wide a block range.'
            err = new Error(msg)
            throw new JsonRpcError.InternalError(err)

          default:
            return res.json()
        }
      }).then(function (body) {
        // check for error code
        switch (res.status) {
          case 405:
            throw new JsonRpcError.MethodNotFound()
          default:
            if (res.status !== 200) {
              throw new JsonRpcError.InternalError(body)
            }
        }
        if (body.error) throw new JsonRpcError.InternalError(body.error)
        return body.result
      })
    )(cb)
  }
}

Service.isAllowed = (method) => Service.allowedMethods.indexOf(method) !== -1

Service.allowedMethods = [
  'getAddresses',
  'approveMessage',
  'approveTransaction',
  'signTransaction',
  'signMessage',
  'signPersonalMessage',
  'rpc'
]

Service.concatSignature = (v, r, s) => {
  r = ethUtil.fromSigned(r)
  s = ethUtil.fromSigned(s)
  v = ethUtil.bufferToInt(v)
  r = ethUtil.toUnsigned(r).toString('hex')
  s = ethUtil.toUnsigned(s).toString('hex')
  v = ethUtil.stripHexPrefix(ethUtil.intToHex(v))
  return ethUtil.addHexPrefix(r.concat(s, v).toString('hex'))
}

export { Service }
