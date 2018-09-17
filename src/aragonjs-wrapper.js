import BN from 'bn.js'
import throttle from 'lodash.throttle'
import resolvePathname from 'resolve-pathname'
import Aragon, {
  providers,
  setupTemplates,
  isNameUsed,
  ensResolve,
} from '@aragon/wrapper'
import {
  appOverrides,
  sortAppsPair,
  appLocator,
  ipfsDefaultConf,
} from './environment'
import { noop, removeStartingSlash, appendTrailingSlash } from './utils'
import { getWeb3 } from './web3-utils'
import { getBlobUrl, WorkerSubscriptionPool } from './worker-utils'
import { InvalidAddress, NoConnection } from './errors'

const KERNEL_BASE = {
  name: 'Kernel',
  appId: 'kernel',
  isAragonOsInternalApp: true,
  roles: [
    {
      name: 'Manage apps',
      id: 'APP_MANAGER_ROLE',
      params: [],
      bytes:
        '0xb6d92708f3d4817afc106147d969e229ced5c46e65e0a5002a0d391287762bd0',
    },
  ],
}

const POLL_DELAY_ACCOUNT = 2000
const POLL_DELAY_NETWORK = 2000
const POLL_DELAY_CONNECTIVITY = 2000

/*
 * Supported locations:
 *   ipfs:{IPFS_HASH}
 *   http:{HOST}
 *   http:{HOST}:{PORT}
 *   http:{HOST}:{PORT}/{PATH}
 *   http:http(s)://{HOST}
 *   http:http(s)://{HOST}:{PORT}
 *   http:http(s)://{HOST}:{PORT}/{PATH}
 */
const appBaseUrl = (app, gateway = ipfsDefaultConf.gateway) => {
  // Support overriding app URLs, see network-config.js
  if (appLocator[app.appId]) {
    return appLocator[app.appId]
  }
  if (!app.content) {
    return ''
  }

  const { provider, location } = app.content
  if (provider === 'ipfs') {
    return `${gateway}/${location}/`
  }
  if (provider === 'http') {
    return /^https?:\/\//.test(location)
      ? appendTrailingSlash(location)
      : `http://${location}/`
  }
  return ''
}

const applyAppOverrides = apps =>
  apps.map(app => ({ ...app, ...(appOverrides[app.appId] || {}) }))

// Sort apps, apply URL overrides, and attach data useful to the frontend
const prepareFrontendApps = (apps, daoAddress, gateway) => {
  return [
    {
      ...KERNEL_BASE,
      proxyAddress: daoAddress,
      hasWebApp: false,
    },
    ...applyAppOverrides(apps)
      .map(app => {
        const baseUrl = appBaseUrl(app, gateway)
        // Remove the starting slash from the start_url field
        // so the absolute path can be resolved from baseUrl.
        const startUrl = removeStartingSlash(app['start_url'] || '')
        const src = baseUrl ? resolvePathname(startUrl, baseUrl) : ''

        return {
          ...app,
          src,
          baseUrl,
          hasWebApp: Boolean(app['start_url']),
        }
      })
      .sort(sortAppsPair),
  ]
}

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
    let lastBalance = new BN(-1)
    return {
      request: () =>
        getMainAccount(web3)
          .then(account => {
            if (!account) {
              throw new Error('no account')
            }
            return web3.eth.getBalance(account).then(balance => ({
              account,
              balance: new BN(balance),
            }))
          })
          .catch(() => {
            return { account: null, balance: new BN(-1) }
          }),
      onResult: ({ account, balance }) => {
        if (account !== lastAccount) {
          lastAccount = account
          onAccount(account)
        }
        if (!balance.eq(lastBalance)) {
          lastBalance = balance
          onBalance(balance)
        }
      },
    }
  },
  POLL_DELAY_ACCOUNT
)

export const pollConnectivity = pollEvery((providers = [], onConnectivity) => {
  let lastFound = null
  return {
    request: async () => {
      try {
        await Promise.all(
          providers.map(p => getWeb3(p).eth.net.getNetworkType())
        )
        return true
      } catch (err) {
        return false
      }
    },
    onResult: connected => {
      if (connected !== lastFound) {
        lastFound = connected
        onConnectivity(connected)
      }
    },
  }
  // web.eth.net.isListening()
}, POLL_DELAY_CONNECTIVITY)

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

// Subscribe to aragon.js observables
const subscribe = (
  wrapper,
  { onApps, onPermissions, onForwarders, onTransaction },
  { ipfsConf }
) => {
  const { apps, permissions, forwarders, transactions } = wrapper

  const workerSubscriptionPool = new WorkerSubscriptionPool()

  const subscriptions = {
    apps: apps.subscribe(apps => {
      onApps(
        prepareFrontendApps(apps, wrapper.kernelProxy.address, ipfsConf.gateway)
      )
    }),
    permissions: permissions.subscribe(throttle(onPermissions, 100)),
    connectedApp: null,
    connectedWorkers: workerSubscriptionPool,
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    workers: apps.subscribe(apps => {
      // Asynchronously launch webworkers for each new app that has a background
      // script defined
      applyAppOverrides(apps)
        .filter(app => app.script)
        .filter(
          ({ proxyAddress }) => !workerSubscriptionPool.hasWorker(proxyAddress)
        )
        .forEach(async app => {
          const { name, proxyAddress, script } = app
          const baseUrl = appBaseUrl(app, ipfsConf.gateway)

          // If the app URL is empty, the script can’t be retrieved
          if (!baseUrl) {
            return
          }

          // Remove the starting slash from the script field to force it to
          // load relative to the app's base url
          const scriptUrl = resolvePathname(
            removeStartingSlash(script),
            baseUrl
          )

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

          // If another execution context already loaded this app's worker
          // before we got to it here, let's short circuit
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
    onPermissions = noop,
    onForwarders = noop,
    onTransaction = noop,
    onDaoAddress = noop,
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
    onError(new InvalidAddress('The provided DAO address is invalid'))
    return
  }

  onDaoAddress(daoAddress)

  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  const web3 = getWeb3(walletProvider || provider)
  onWeb3(web3)

  const account = await getMainAccount(web3)
  try {
    await wrapper.init(account && [account])
  } catch (err) {
    if (err.message === 'connection not open') {
      onError(
        new NoConnection(
          'The wrapper can not be initialized without a connection'
        )
      )
      return
    }
    throw err
  }

  const subscriptions = subscribe(
    wrapper,
    { onApps, onPermissions, onForwarders, onTransaction },
    { ipfsConf }
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
      !(await isNameUsed(name, { provider, registryAddress })),
  }
}

export default initWrapper
