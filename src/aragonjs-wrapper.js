import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'
import Aragon, {
  providers,
  setupTemplates,
  isNameUsed,
  ensResolve,
} from '@aragon/wrapper'
import { appDefaults, appLocator, ipfsDefaultConf } from './environment'
import { noop, removeTrailingSlash } from './utils'
import { getBlobUrl, WorkerSubscriptionPool } from './worker-utils'

const POLL_DELAY_ACCOUNT = 2000
const POLL_DELAY_NETWORK = 2000

const appSrc = (app, gateway = ipfsDefaultConf.gateway) => {
  const hash = app.content && app.content.location
  if (!hash) return ''

  if (appLocator[app.appId]) {
    return appLocator[app.appId]
  }

  return `${gateway}/${hash}/`
}

// Cache web3 instances used in this module
const getWeb3 = (() => {
  const cache = new WeakMap()
  return provider => {
    if (cache.has(provider)) {
      return cache.get(provider)
    }
    const web3 = new Web3(provider)
    cache.set(provider, web3)
    return web3
  }
})()

// Filter out apps without UI and add an appSrc property
const prepareFrontendApps = (apps, gateway) =>
  apps
    .map(app => ({ ...(appDefaults[app.appId] || {}), ...app }))
    .filter(app => app && app['short_url'])
    .map(app => ({ ...app, appSrc: appSrc(app, gateway) }))

const getMainAccount = async web3 => {
  try {
    const accounts = await web3.eth.getAccounts()
    return (accounts && accounts[0]) || null
  } catch (err) {
    return null
  }
}

const pollEvery = (fn, delay) => {
  let timer = -1
  let stop = false
  const poll = async (request, onResult) => {
    const result = await request()
    if (!stop) {
      onResult(result)
      timer = setTimeout(poll.bind(null, request, onResult), delay)
    }
  }
  return (...params) => {
    const { request, onResult } = fn(...params)
    poll(request, onResult)
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }
}

// Keep polling the main account.
// See https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
export const pollMainAccount = pollEvery(
  (provider, { onAccount = () => {}, onBalance = () => {} } = {}) => {
    const web3 = getWeb3(provider)
    let lastAccount = null
    let lastBalance = -1
    return {
      request: () =>
        getMainAccount(web3)
          .then(account => {
            if (!account) {
              throw new Error('no account')
            }
            return web3.eth.getBalance(account).then(balance => ({
              account,
              balance: BigNumber(balance),
            }))
          })
          .catch(() => {
            return { account: null, balance: BigNumber(-1) }
          }),
      onResult: ({ account, balance }) => {
        if (account !== lastAccount) {
          lastAccount = account
          onAccount(account)
        }
        if (!balance.isEqualTo(lastBalance)) {
          lastBalance = balance
          onBalance(balance)
        }
      },
    }
  },
  POLL_DELAY_ACCOUNT
)

// Keep polling the network.
export const pollNetwork = pollEvery((provider, onNetwork) => {
  const web3 = getWeb3(provider)
  let lastFound = null
  return {
    request: () => web3.eth.net.getNetworkType(),
    onResult: network => {
      if (network !== lastFound) {
        lastFound = network
        onNetwork(network)
      }
    },
  }
}, POLL_DELAY_NETWORK)

// Subscribe to wrapper's observables
const subscribe = (
  wrapper,
  { onApps, onForwarders, onTransaction },
  { ipfsConf }
) => {
  const { apps, forwarders, transactions } = wrapper
  const workerSubscriptionPool = new WorkerSubscriptionPool()

  const subscriptions = {
    apps: apps.subscribe(apps => {
      const frontendApps = prepareFrontendApps(apps, ipfsConf.gateway)
      onApps(frontendApps, apps)
    }),
    connectedApp: null,
    connectedWorkers: workerSubscriptionPool,
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    workers: apps.subscribe(apps => {
      // Asynchronously launch webworkers for each new app that has a background
      // script defined
      apps
        .map(app => ({ ...(appDefaults[app.appId] || {}), ...app }))
        .filter(app => app.script)
        .filter(
          ({ proxyAddress }) => !workerSubscriptionPool.hasWorker(proxyAddress)
        )
        .forEach(async app => {
          const { name, proxyAddress, script } = app
          const scriptUrl =
            removeTrailingSlash(appSrc(app, ipfsConf.gateway)) + script
          let workerUrl = ''
          try {
            // WebWorkers can only load scripts from the local origin, so we
            // have to fetch the script as text and make a blob out of it
            workerUrl = await getBlobUrl(scriptUrl)
          } catch (e) {
            console.error(
              `Failed to load ${name}(${proxyAddress})'s script (${script}): `,
              e
            )
            return
          }

          // If another execution context already loaded this app's worker before we got to it here,
          // let's short circuit
          if (!workerSubscriptionPool.hasWorker(proxyAddress)) {
            const worker = new Worker(workerUrl)
            worker.addEventListener(
              'error',
              err =>
                console.error(
                  `Error from worker for ${name}(${proxyAddress}):`,
                  err
                ),
              false
            )

            const provider = new providers.MessagePortMessage(worker)
            workerSubscriptionPool.addWorker({
              app,
              worker,
              subscription: wrapper.runApp(provider, proxyAddress).shutdown,
            })
          }

          // Clean up the url we created to spawn the worker
          URL.revokeObjectURL(workerUrl)
        })
    }),
  }

  return subscriptions
}

const resolveEnsDomain = async (domain, opts) => {
  try {
    return await ensResolve(domain, opts)
  } catch (err) {
    if (err.message === 'ENS name not defined.') {
      return ''
    }
    throw err
  }
}

const initWrapper = async (
  dao,
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
  } = {}
) => {
  const isDomain = /[a-z0-9]+\.aragonid\.eth/.test(dao)

  const daoAddress = isDomain
    ? await resolveEnsDomain(dao, {
        provider,
        registryAddress: ensRegistryAddress,
      })
    : dao

  if (!daoAddress) {
    console.log('Invalid DAO address')
    return
  }

  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  const web3 = getWeb3(walletProvider || provider)
  onWeb3(web3)

  const account = await getMainAccount(web3)
  if (account === null) {
    throw new Error(
      'No accounts detected in the environment (try to unlock your wallet)'
    )
  }

  try {
    await wrapper.init([account])
  } catch (err) {
    if (err.message === 'connection not open') {
      onError('NO_CONNECTION')
      return
    }
    throw err
  }

  const subscriptions = subscribe(
    wrapper,
    {
      onApps,
      onForwarders,
      onTransaction,
    },
    {
      ipfsConf,
    }
  )

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

const templateParamFilters = {
  democracy: (
    // supportNeeded: Number between 0 (0%) and 1 (100%).
    // minAcceptanceQuorum: Number between 0 (0%) and 1 (100%).
    // voteDuration: Duration in seconds.
    { supportNeeded, minAcceptanceQuorum, voteDuration },
    account
  ) => {
    const tokenBase = Math.pow(10, 18)
    const percentageBase = Math.pow(10, 18)
    const holders = [{ address: account, balance: 1 }]

    const [accounts, stakes] = holders.reduce(
      ([accounts, stakes], holder) => [
        [...accounts, holder.address],
        [...stakes, holder.balance * tokenBase],
      ],
      [[], []]
    )

    return [
      accounts,
      stakes,
      supportNeeded * percentageBase,
      minAcceptanceQuorum * percentageBase,
      voteDuration,
    ]
  },

  multisig: (
    // signers: Accounts corresponding to the signers.
    // neededSignatures: Minimum number of signatures needed.
    { signers, neededSignatures },
    account
  ) => {
    if (!signers || signers.length === 0) {
      throw new Error('signers should contain at least one account:', signers)
    }

    if (neededSignatures < 1 || neededSignatures > signers.length) {
      throw new Error(
        'neededSignatures must be between 1 the total number of signers',
        neededSignatures
      )
    }

    return [signers, neededSignatures]
  },
}

export const initDaoBuilder = (
  provider,
  registryAddress,
  ipfsConf = ipfsDefaultConf
) => {
  // DEV only
  // provider = new Web3.providers.WebsocketProvider('ws://localhost:8546')

  return {
    build: async (templateName, organizationName, settings = {}) => {
      if (!organizationName) {
        throw new Error('No organization name set')
      }
      if (!templateName || !templateParamFilters[templateName]) {
        throw new Error('The template name doesn’t exist')
      }

      const web3 = getWeb3(provider)
      const account = await getMainAccount(web3)

      if (account === null) {
        throw new Error(
          'No accounts detected in the environment (try to unlock your wallet)'
        )
      }

      const templates = setupTemplates(provider, registryAddress, account)
      const templateFilter = templateParamFilters[templateName]
      const templateData = templateFilter(settings, account)

      return templates.newDAO(templateName, organizationName, templateData)
    },
    isNameAvailable: async name =>
      !await isNameUsed(name, { provider, registryAddress }),
  }
}

export default initWrapper
