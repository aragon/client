import React from 'react'
import createHistory from 'history/createHashHistory'
import { contractAddresses, web3Providers } from './environment'
import { parsePath } from './routing'
import initWrapper, {
  initDaoBuilder,
  pollMainAccount,
  pollNetwork,
  pollConnectivity,
} from './aragonjs-wrapper'
import Wrapper from './Wrapper'
import Onboarding from './onboarding/Onboarding'
import { getWeb3, getUnknownBalance, identifyProvider } from './web3-utils'
import { enableWallet } from './wallet-utils'
import { log } from './utils'
import { ActivityProvider } from './contexts/ActivityContext'
import { FavoriteDaosProvider } from './contexts/FavoriteDaosContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { ModalProvider } from './components/ModalManager/ModalManager'
import { IdentityProvider } from './components/IdentityManager/IdentityManager'
import { LocalIdentityModalProvider } from './components/LocalIdentityModal/LocalIdentityModalManager'
import LocalIdentityModal from './components/LocalIdentityModal/LocalIdentityModal'
import Beacon from './components/Beacon/Beacon'
import { isKnownRepo } from './repo-utils'
import {
  APP_MODE_START,
  APP_MODE_ORG,
  APP_MODE_SETUP,
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
  APPS_STATUS_UNLOADED,
  DAO_STATUS_ERROR,
  DAO_STATUS_READY,
  DAO_STATUS_LOADING,
  DAO_STATUS_UNLOADED,
  DAO_CREATION_STATUS_NONE,
  DAO_CREATION_STATUS_SUCCESS,
  DAO_CREATION_STATUS_ERROR,
} from './symbols'

const INITIAL_DAO_STATE = {
  apps: [],
  appIdentifiers: {},
  appsStatus: APPS_STATUS_UNLOADED,
  daoAddress: { address: '', domain: '' },
  daoStatus: DAO_STATUS_UNLOADED,
  permissions: {},
  permissionsLoading: true,
  repos: [],
}

class App extends React.Component {
  state = {
    ...INITIAL_DAO_STATE,
    account: '',
    balance: getUnknownBalance(),
    buildData: null, // data returned by aragon.js when a DAO is created
    connected: false,
    // daoCreationStatus is one of:
    //  - DAO_CREATION_STATUS_NONE
    //  - DAO_CREATION_STATUS_SUCCESS
    //  - DAO_CREATION_STATUS_ERROR
    daoCreationStatus: DAO_CREATION_STATUS_NONE,
    fatalError: null,
    identityIntent: null,
    locator: {},
    prevLocator: null,
    selectorNetworks: [
      ['main', 'Ethereum Mainnet', 'https://mainnet.aragon.org/'],
      ['rinkeby', 'Ethereum Testnet (Rinkeby)', 'https://rinkeby.aragon.org/'],
    ],
    transactionBag: null,
    signatureBag: null,
    walletNetwork: '',
    walletProviderId: identifyProvider(web3Providers.wallet),
    walletWeb3: getWeb3(web3Providers.wallet),
    web3: getWeb3(web3Providers.default),
    wrapper: null,
  }

  history = createHistory()

  componentDidMount() {
    const { pathname, search } = this.history.location
    this.handleHistoryChange({ pathname, search })
    this.history.listen(this.handleHistoryChange)

    pollMainAccount(web3Providers.wallet, {
      onAccount: (account = null) => {
        this.setState({ account })
        if (account && this.state.wrapper) {
          this.state.wrapper.setAccounts([account])
        }
      },
      onBalance: balance => {
        this.setState({ balance })
      },
    })

    pollNetwork(web3Providers.wallet, walletNetwork => {
      this.setState({ walletNetwork })
    })

    // Only the default, because the app can work without the wallet
    pollConnectivity([web3Providers.default], connected => {
      this.setState({ connected })
    })
  }

  // Handle URL changes
  handleHistoryChange = ({ pathname, search }) => {
    this.updateLocator(parsePath(pathname, search))
  }

  // Change the URL if needed
  historyPush = path => {
    if (path !== this.state.locator.path) {
      this.history.push(path)
    }
  }

  // Change the URL to the previous one
  historyBack = () => {
    if (this.state.prevLocator) {
      this.history.goBack()
    } else {
      this.history.replace('/')
    }
  }

  updateLocator = locator => {
    const { locator: prevLocator } = this.state

    if (locator.mode === APP_MODE_START || locator.mode === APP_MODE_SETUP) {
      this.updateDaoBuilder()
    }

    // New DAO: need to reinit the wrapper
    if (locator.dao && (!prevLocator || locator.dao !== prevLocator.dao)) {
      this.updateDao(locator.dao)
    }

    // Moving from a DAO to somewhere else (like onboarding):
    // need to cancel the subscribtions.
    if (!locator.dao && prevLocator && prevLocator.dao) {
      this.updateDao(null)
    }

    this.setState({ locator, prevLocator })
  }

  async updateDaoBuilder() {
    const daoBuilder = initDaoBuilder(
      web3Providers.wallet,
      contractAddresses.ensRegistry
    )
    this.setState({
      daoBuilder,
      appsStatus: APPS_STATUS_UNLOADED,
      daoStatus: DAO_STATUS_UNLOADED,
    })
  }

  handleResetDaoBuilder = () => {
    this.setState({
      appsStatus: APPS_STATUS_UNLOADED,
      buildData: null,
      daoCreationStatus: DAO_CREATION_STATUS_NONE,
      daoStatus: DAO_STATUS_UNLOADED,
    })
  }

  handleBuildDao = async (templateName, organizationName, data) => {
    const { daoBuilder } = this.state
    try {
      const [token, dao] = await daoBuilder.build(
        templateName,
        organizationName,
        data
      )
      const domain = `${organizationName}.aragonid.eth`
      this.setState({
        daoCreationStatus: DAO_CREATION_STATUS_SUCCESS,
        buildData: { token, dao, domain },
      })
      log('DAO created', dao, token, domain)
    } catch (err) {
      log(err)
      this.setState({ daoCreationStatus: DAO_CREATION_STATUS_ERROR })
    }
  }

  updateDao(dao = null) {
    // Cancel the subscriptions / unload the wrapper
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }

    // Reset the DAO state
    this.setState({
      ...INITIAL_DAO_STATE,
    })

    if (dao === null) {
      return
    }

    // Loading state
    this.setState({
      appsStatus: APPS_STATUS_LOADING,
      daoStatus: DAO_STATUS_LOADING,
    })

    log('Init DAO', dao)
    initWrapper(dao, contractAddresses.ensRegistry, {
      provider: web3Providers.default,
      walletProvider: web3Providers.wallet,
      onError: err => {
        log(`Wrapper init, recoverable error: ${err.name}. ${err.message}.`)
        this.setState({
          appsStatus: APPS_STATUS_ERROR,
          daoStatus: DAO_STATUS_ERROR,
        })
      },
      onDaoAddress: ({ address, domain }) => {
        log('dao address', address)
        log('dao domain', domain)
        this.setState({
          daoStatus: DAO_STATUS_READY,
          daoAddress: { address, domain },
        })
      },
      onWeb3: web3 => {
        log('web3', web3)
      },
      onApps: apps => {
        log('apps updated', apps)
        this.setState({
          apps,
          appsStatus: APPS_STATUS_READY,
        })
      },
      onPermissions: permissions => {
        log('permissions updated', permissions)
        this.setState({
          permissions,
          permissionsLoading: false,
        })
      },
      onForwarders: forwarders => {
        log('forwarders', forwarders)
      },
      onAppIdentifiers: appIdentifiers => {
        log('app identifiers', appIdentifiers)
        this.setState({ appIdentifiers })
      },
      onInstalledRepos: repos => {
        log('installed repos', repos)
        const canUpgradeOrg = repos.some(
          ({ appId, currentVersion, latestVersion }) =>
            isKnownRepo(appId) &&
            currentVersion.version.split('.')[0] !==
              latestVersion.version.split('.')[0]
        )
        this.setState({ canUpgradeOrg, repos })
      },
      onTransaction: transactionBag => {
        log('transaction bag', transactionBag)
        this.setState({ transactionBag })
      },
      onSignatures: signatureBag => {
        log('signature bag', signatureBag)
        this.setState({ signatureBag })
      },
      onIdentityIntent: async identityIntent => {
        // set the state for modifying a specific address identity
        let name = null
        try {
          const identity = await this.handleIdentityResolve(
            identityIntent.address
          )
          name = identity.name
        } catch (e) {}
        this.setState({
          identityIntent: {
            label: name,
            ...identityIntent,
          },
        })
      },
    })
      .then(wrapper => {
        log('wrapper', wrapper)
        this.setState({ wrapper })
        return wrapper
      })
      .catch(err => {
        log(`Wrapper init, fatal error: ${err.name}. ${err.message}.`)
        this.setState({ fatalError: err })
      })
  }

  handleRequestAppsReload = () => {
    this.setState({ appsStatus: APPS_STATUS_LOADING, apps: [] })
    clearTimeout(this._requestAppsTimer)
    this._requestAppsTimer = setTimeout(() => {
      this.updateDao(this.state.locator.dao)
    }, 1000)
  }

  handleIdentityCancel = () => {
    const { identityIntent } = this.state
    identityIntent.reject(new Error('Identity modification cancelled'))
    this.setState({ identityIntent: null })
  }

  handleIdentitySave = ({ address, label }) => {
    const { identityIntent } = this.state
    this.state.wrapper
      .modifyAddressIdentity(address, { name: label })
      .then(identityIntent.resolve)
      .then(() => this.setState({ identityIntent: null }))
      .catch(identityIntent.reject)
  }

  handleIdentityResolve = address => {
    // returns promise
    if (this.state.wrapper) {
      return this.state.wrapper.resolveAddressIdentity(address)
    } else {
      // wrapper has not been initialized
      // re-request in 100 ms
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await this.handleIdentityResolve(address))
        }, 100)
      })
    }
  }

  handleCompleteOnboarding = () => {
    const { domain } = this.state.buildData
    this.historyPush(`/${domain}`)
  }
  handleOpenOrganization = address => {
    this.historyPush(`/${address}`)
  }
  handleOpenLocalIdentityModal = address => {
    return this.state.wrapper.requestAddressIdentityModification(address)
  }

  render() {
    const {
      account,
      apps,
      appIdentifiers,
      appsStatus,
      balance,
      canUpgradeOrg,
      connected,
      daoAddress,
      daoStatus,
      daoCreationStatus,
      fatalError,
      identityIntent,
      locator,
      permissions,
      permissionsLoading,
      repos,
      selectorNetworks,
      transactionBag,
      signatureBag,
      walletNetwork,
      walletProviderId,
      walletWeb3,
      web3,
      wrapper,
    } = this.state

    const { mode, dao } = locator
    const { address: intentAddress = null, label: intentLabel = '' } =
      identityIntent || {}

    if (!mode) {
      return null
    }
    if (mode === 'invalid') {
      throw new Error(
        `URL contained invalid organization name or address (${dao}).\nPlease modify it to be a valid ENS name or address.`
      )
    }
    if (fatalError !== null) {
      throw fatalError
    }

    const appsWithIdentifiers = apps.map(app => {
      const identifier = appIdentifiers[app.proxyAddress]
      return identifier
        ? {
            identifier,
            ...app,
          }
        : app
    })

    return (
      <IdentityProvider onResolve={this.handleIdentityResolve}>
        <ModalProvider>
          <LocalIdentityModalProvider
            onShowLocalIdentityModal={this.handleOpenLocalIdentityModal}
          >
            <LocalIdentityModal
              address={intentAddress}
              label={intentLabel}
              opened={identityIntent !== null}
              onCancel={this.handleIdentityCancel}
              onSave={this.handleIdentitySave}
            />
            <FavoriteDaosProvider>
              <ActivityProvider
                account={account}
                daoDomain={daoAddress.domain}
                web3={web3}
              >
                <PermissionsProvider
                  wrapper={wrapper}
                  apps={appsWithIdentifiers}
                  permissions={permissions}
                >
                  <div css="position: relative; z-index: 1">
                    <Wrapper
                      visible={mode === APP_MODE_ORG}
                      account={account}
                      apps={appsWithIdentifiers}
                      appsStatus={appsStatus}
                      canUpgradeOrg={canUpgradeOrg}
                      connected={connected}
                      daoAddress={daoAddress}
                      daoStatus={daoStatus}
                      historyBack={this.historyBack}
                      historyPush={this.historyPush}
                      locator={locator}
                      onRequestAppsReload={this.handleRequestAppsReload}
                      onRequestEnable={enableWallet}
                      permissionsLoading={permissionsLoading}
                      repos={repos}
                      signatureBag={signatureBag}
                      transactionBag={transactionBag}
                      walletNetwork={walletNetwork}
                      walletProviderId={walletProviderId}
                      walletWeb3={walletWeb3}
                      web3={web3}
                      wrapper={wrapper}
                    />
                  </div>
                </PermissionsProvider>

                <div css="position: relative; z-index: 2">
                  <Onboarding
                    visible={mode === APP_MODE_START || mode === APP_MODE_SETUP}
                    account={account}
                    balance={balance}
                    daoCreationStatus={daoCreationStatus}
                    onBuildDao={this.handleBuildDao}
                    onComplete={this.handleCompleteOnboarding}
                    onOpenOrganization={this.handleOpenOrganization}
                    onRequestEnable={enableWallet}
                    onResetDaoBuilder={this.handleResetDaoBuilder}
                    selectorNetworks={selectorNetworks}
                    walletNetwork={walletNetwork}
                    walletProviderId={walletProviderId}
                  />
                </div>

                <Beacon />
              </ActivityProvider>
            </FavoriteDaosProvider>
          </LocalIdentityModalProvider>
        </ModalProvider>
      </IdentityProvider>
    )
  }
}

export default App
