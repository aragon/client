// import Web3 from 'web3'
import Aragon from '@aragon/wrapper'
import { noop } from './utils'

const IPFS_CONF_DEFAULT = {
  rpc: { host: 'ipfs.infura.io', port: '5001', protocol: 'https' },
}

const getCache = () => JSON.parse(localStorage.getItem('wrapper-cache') || '{}')

const setCache = obj =>
  localStorage.setItem(
    'wrapper-cache',
    JSON.stringify(Object.assign({}, getCache(), obj))
  )

const appSrc = (app = {}) => {
  const hash = app.content && app.content.location
  if (!hash) return ''

  // TODO: move this in the env settings
  // This is the Voting app hash in the dev template
  if (hash === 'QmV5sEjshcZ6mu6uFUhJkWM5nTa53wbHfRFDD4Qy2Yx88m') {
    return 'http://localhost:3001/'
  }

  return `https://gateway.ipfs.io/ipfs/${hash}/`
}

// Filter out apps without UI and add an appSrc property
const prepareMenuApps = apps =>
  apps
    .filter(app => app.content && app.name !== 'Vault')
    .map(app => ({ ...app, appSrc: appSrc(app) }))

const initWrapper = async (
  daoAddress,
  ensRegistryAddress,
  {
    provider,
    signingProvider = null,
    ipfsConf = IPFS_CONF_DEFAULT,
    onApps = noop,
    onMenuApps = noop,
    onForwarders = noop,
    onTransaction = noop,
    onWrapper = noop,
    onSigningWeb3 = noop,
    onAccount = noop,
  } = {}
) => {
  const initialCache = getCache()

  onApps(initialCache.apps || [])
  onMenuApps(initialCache.menuApps || [])

  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  // TODO: using window.web3 instead of new Web3 for now,
  // to make MetaMask work with Ganache.
  // const signingWeb3 = new Web3(signingProvider || provider)
  const signingWeb3 = window.web3

  onSigningWeb3(signingWeb3)

  const [, account] = await Promise.all([
    wrapper.init(),

    // getAccounts() doesn’t return a promise until 1.0
    new Promise((resolve, reject) => {
      signingWeb3.eth.getAccounts((err, accounts) => {
        if (err) return reject(err)
        resolve(accounts)
      })
    }).then(accounts => accounts[0]),
  ])
  onAccount(account || null)

  const { apps, forwarders, transactions } = wrapper

  apps.subscribe(apps => {
    const menuApps = prepareMenuApps(apps)
    setCache({ apps, menuApps })
    onApps(apps)
    onMenuApps(menuApps)
  })

  forwarders.subscribe(onForwarders)
  transactions.subscribe(onTransaction)

  onWrapper(wrapper)
}

export default initWrapper
