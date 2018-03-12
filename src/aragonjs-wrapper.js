import Aragon from '@aragon/wrapper'
import Web3 from 'web3'
import { providers } from '@aragon/messenger'
import { appIds, appLocator, ipfsDefaultConf } from './environment'
import { noop } from './utils'

const ACCOUNTS_POLL_EVERY = 2000

const appSrc = (app = {}, gateway = ipfsDefaultConf.gateway) => {
  const hash = app.content && app.content.location
  if (!hash) return ''

  if (appLocator[app.appId]) {
    return appLocator[app.appId]
  }

  return `${gateway}/${hash}/`
}

// Filter out apps without UI and add an appSrc property
const prepareFrontendApps = (apps, gateway) =>
  apps
    .filter(app => app.content && app.appId !== appIds['Vault'])
    .map(app => ({ ...app, appSrc: appSrc(app, gateway) }))

const initWrapper = async (
  daoAddress,
  ensRegistryAddress,
  {
    provider,
    walletProvider = null,
    ipfsConf = ipfsDefaultConf,
    onError = noop,
    onApps = noop,
    onForwarders = noop,
    onTransaction = noop,
    onWeb3 = noop,
    onAccounts = noop,
  } = {}
) => {
  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  const web3 = new Web3(walletProvider || provider)
  onWeb3(web3)

  const pollAccounts = () => {
    if (!web3) {
      return
    }
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        onAccounts(accounts || [])
      }
      setTimeout(pollAccounts, ACCOUNTS_POLL_EVERY)
    })
  }
  pollAccounts()

  try {
    await wrapper.init()
  } catch (err) {
    if (err.message === 'connection not open') {
      onError('NO_CONNECTION')
      return
    }
    throw err
  }

  const { apps, forwarders, transactions } = wrapper

  const subscriptions = {
    apps: apps.subscribe(apps => {
      const frontendApps = prepareFrontendApps(apps, ipfsConf.gateway)
      onApps(frontendApps, apps)
    }),
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    connectedApp: null,
  }

  wrapper.connectAppIFrame = (iframeElt, proxyAddress) => {
    const provider = new providers.WindowMessage(iframeElt.contentWindow)
    const result = wrapper.runApp(provider, proxyAddress)
    if (subscriptions.connectedApp) {
      subscriptions.connectedApp.unsubscribe()
    }
    subscriptions.connectedApp = result.shutdown
    return result
  }

  wrapper.cancel = () => {
    Object.values(subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe()
      }
    })
  }

  return wrapper
}

export default initWrapper
