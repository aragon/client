import Web3 from 'web3'
import removeTrailingSlash from 'remove-trailing-slash'
import Aragon, { providers, setupTemplates } from '@aragon/wrapper'
import { appDefaults, appIds, appLocator, ipfsDefaultConf } from './environment'
import { noop } from './utils'
import { getBlobUrl, WorkerSubscriptionPool } from './worker-utils'

const ACCOUNTS_POLL_EVERY = 2000

const appSrc = (app, gateway = ipfsDefaultConf.gateway) => {
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
    .map(app => ({ ...(appDefaults[app.appId] || {}), ...app }))
    .filter(app => app && app['short_url'] && app.appId !== appIds['Vault'])
    .map(app => ({ ...app, appSrc: appSrc(app, gateway) }))

// Keep polling accounts to notice when the user unlocks their wallet
const pollAccounts = (web3, onAccounts) => {
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

          const worker = new Worker(workerUrl)
          worker.addEventListener(
            'error',
            err =>
              console.log(
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

          // Clean up the url we created to spawn the worker
          URL.revokeObjectURL(workerUrl)
        })
    }),
  }

  return subscriptions
}

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

  pollAccounts(web3, onAccounts)

  try {
    await wrapper.init()
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
    // holders: Token holders. Structure: [ { address: '0x...', balance: 120 }, ... ]
    // supportNeeded: Number between 0 (0%) and 1 (100%).
    // minAcceptanceQuorum: Number between 0 (0%) and 1 (100%).
    // voteDuration: Duration in seconds.
    { holders, supportNeeded, minAcceptanceQuorum, voteDuration }
  ) => {
    if (!holders || holders.length === 0) {
      throw new Error('holders should contain at least one account:', holders)
    }

    const tokenBase = Math.pow(10, 18)
    const percentageBase = Math.pow(10, 18)

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
    { signers, neededSignatures }
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

const getMainAccount = async web3 => {
  try {
    const accounts = await web3.eth.getAccounts()
    return (accounts && accounts[0]) || null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const initDaoBuilder = (
  provider,
  registryAddress,
  ipfsConf = ipfsDefaultConf
) => async (templateName, organizationName, settings = {}) => {
  if (!organizationName) {
    throw new Error('No organization name set')
  }
  if (!templateName || !templateParamFilters[templateName]) {
    throw new Error('The template name doesn’t exist')
  }

  // DEV only
  provider = new Web3.providers.WebsocketProvider('ws://localhost:8546')

  const web3 = new Web3(provider)

  const account = await getMainAccount(web3)
  console.log('Main account:', account)

  if (account === null) {
    throw new Error(
      'No accounts detected in the environment (try to unlock your wallet)'
    )
  }

  const templates = setupTemplates(provider, registryAddress, account)
  const templateFilter = templateParamFilters[templateName]
  const templateData = templateFilter(settings)

  return templates.newDAO(templateName, organizationName, templateData)
}

export default initWrapper
