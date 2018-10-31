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
import { getWeb3, getUnknownBalance } from './web3-utils'
import { log } from './utils'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { ModalProvider } from './components/ModalManager/ModalManager'
import DeprecatedBanner from './components/DeprecatedBanner/DeprecatedBanner'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from './symbols'

class App extends React.Component {
  state = {
    fatalError: null,
    locator: {},
    prevLocator: null,
    wrapper: null,
    account: '',
    balance: getUnknownBalance(),
    connected: false,
    apps: [],
    appsStatus: APPS_STATUS_LOADING,
    permissions: [],
    permissionsLoading: true,
    walletWeb3: null,
    daoAddress: '',
    daoCreationStatus: 'none', // none / success / error
    buildData: null, // data returned by aragon.js when a DAO is created
    transactionBag: null,
    walletNetwork: '',
    showDeprecatedBanner: false,
    selectorNetworks: [
      ['main', 'Ethereum Mainnet', 'https://mainnet.aragon.org/'],
      ['rinkeby', 'Ethereum Testnet (Rinkeby)', 'https://rinkeby.aragon.org/'],
    ],
  }

  history = createHistory()

  componentDidMount() {
    const { pathname, search } = this.history.location
    this.handleHistoryChange({ pathname, search })
    this.history.listen(this.handleHistoryChange)

    if (!web3Providers.wallet) {
      return
    }
    this.setState({
      walletWeb3: getWeb3(web3Providers.wallet),
    })

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

    if (locator.mode === 'home' || locator.mode === 'setup') {
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
    this.setState({ daoBuilder })
  }

  handleResetDaoBuilder = () => {
    this.setState({
      daoCreationStatus: 'none',
      buildData: null,
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
        daoCreationStatus: 'success',
        buildData: { token, dao, domain },
      })
      log('DAO created', dao, token, domain)
    } catch (err) {
      log(err)
      this.setState({ daoCreationStatus: 'error' })
    }
  }

  updateDao(dao = null) {
    // Cancel the subscriptions / unload the wrapper
    if (dao === null && this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
      return
    }

    this.setState({ appsStatus: APPS_STATUS_LOADING, apps: [] })

    log('Wrapper init', dao)
    initWrapper(dao, contractAddresses.ensRegistry, {
      provider: web3Providers.default,
      walletProvider: web3Providers.wallet,
      onError: err => {
        log(`Wrapper init, recoverable error: ${err.name}. ${err.message}.`)
        this.setState({ appsStatus: APPS_STATUS_ERROR })
      },
      onDaoAddress: daoAddress => {
        log('daoAddress', daoAddress)
        this.setState({ daoAddress })
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
      onTransaction: transactionBag => {
        log('transaction bag', transactionBag)
        this.setState({ transactionBag })
      },
    })
      .then(wrapper => {
        log('wrapper', wrapper)
        this.setState({ wrapper })
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

  handleCompleteOnboarding = () => {
    const { domain } = this.state.buildData
    this.historyPush(`/${domain}`)
  }
  handleOpenOrganization = address => {
    this.historyPush(`/${address}`)
  }

  render() {
    const {
      fatalError,
      locator,
      wrapper,
      apps,
      permissions,
      account,
      balance,
      walletNetwork,
      transactionBag,
      daoCreationStatus,
      walletWeb3,
      connected,
      daoAddress,
      appsStatus,
      permissionsLoading,
      showDeprecatedBanner,
      selectorNetworks,
    } = this.state

    const { mode, dao } = locator
    if (!mode) return null

    if (fatalError !== null) {
      throw fatalError
    }

    return (
      <ModalProvider>
        <PermissionsProvider
          wrapper={wrapper}
          apps={apps}
          permissions={permissions}
        >
          <Wrapper
            banner={showDeprecatedBanner && <DeprecatedBanner dao={dao} />}
            historyBack={this.historyBack}
            historyPush={this.historyPush}
            locator={locator}
            wrapper={wrapper}
            apps={apps}
            appsStatus={appsStatus}
            permissionsLoading={permissionsLoading}
            account={account}
            walletNetwork={walletNetwork}
            walletWeb3={walletWeb3}
            daoAddress={daoAddress}
            transactionBag={transactionBag}
            connected={connected}
            onRequestAppsReload={this.handleRequestAppsReload}
          />
        </PermissionsProvider>

        <Onboarding
          banner={
            showDeprecatedBanner && <DeprecatedBanner dao={dao} lightMode />
          }
          visible={mode === 'home' || mode === 'setup'}
          account={account}
          balance={balance}
          walletNetwork={walletNetwork}
          onBuildDao={this.handleBuildDao}
          daoCreationStatus={daoCreationStatus}
          onComplete={this.handleCompleteOnboarding}
          onOpenOrganization={this.handleOpenOrganization}
          onResetDaoBuilder={this.handleResetDaoBuilder}
          selectorNetworks={selectorNetworks}
        />
      </ModalProvider>
    )
  }
}

export default App
