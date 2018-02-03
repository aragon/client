import { apps } from './demo-state'

export class IFrameMessenger {
  constructor(iframe) {
    this.iframe = iframe
  }
  send = data => {
    this.iframe.contentWindow.postMessage(data, '*')
  }
}

export class WorkerMessenger {
  constructor(worker) {
    this.worker = worker
  }
  send = data => {
    this.worker.postMessage(data)
  }
}

// Mock aragon-js implementation
// TODO: actually integrate aragon-js
export default class Aragon {
  constructor() {
    this.appCache = apps.reduce((cache, app) => {
      cache[app.id] = {}
      return cache
    }, {})
    this.messengers = {}
  }
  addMessenger = (id, messenger) => {
    this.messengers[id] = messenger
  }
  getInstalledApps = () => {
    return Promise.resolve(apps)
  }
  handleMessage = (appId, event) => {
    const { data: { method, payload } } = event

    switch (method) {
      case 'events':
        console.log(`${appId} subscribed to events`)
        break
      case 'call':
        this.propagateCall(appId, { payload })
        break
      case 'intent':
        this.propagateIntent(appId, { payload })
        break
      case 'cache':
        if (payload.mode === 'set') {
          this.appCache[appId][payload.key] = payload.value
        }
        // Propagate state change to app if it's currently open
        this.propagateCache(appId, payload.key)
        break
      case 'error':
        // Only for demo purposes to invoke the worker's onerror
        this.messengers[appId].send(appId, { method, payload })
        break
      default:
        if (method) {
          console.error(
            "RPC calls can only use 'call', 'cache', 'events', 'intent', or 'notification' methods"
          )
        } else {
          // Ignore any messages sent (e.g. by extensions) that don't conform to
          // our messaging standard
          console.log('Ignored message:', event)
        }

        break
    }
  }
  propagateCache = (appId, key) => {
    const matches = window.location.hash.match(/^#\/?(\w+)\/?(\w+)?/)
    const currentAppId = matches[1]
    if (
      appId === currentAppId &&
      appId !== 'home' &&
      appId !== 'permissions' &&
      appId !== 'settings'
    ) {
      this.messengers.iframe.send({
        method: 'cache',
        payload: {
          key,
          mode: 'get',
          value: this.appCache[appId][key],
        },
      })
    }
  }
  propagateCall = (appId, data) => {
    this.sendBlockchain(appId, {
      data,
      method: 'call',
    })
  }
  propagateIntent = (appId, data) => {
    this.sendBlockchain(appId, {
      data,
      method: 'intent',
    })
  }
  sendBlockchain = (appId, data) => {
    // TODO: actually send a proper TX rather than a mock event response
    this.messengers[appId].send({
      method: 'events',
      data: data.payload,
    })
  }
}
