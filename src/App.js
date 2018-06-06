import React from 'react'
import createHistory from 'history/createHashHistory'
import { AragonApp } from '@aragon/ui'
import { networkContextType } from './context/provideNetwork'
import { contractAddresses, network, web3Providers } from './environment'
import { parsePath } from './routing'
import initWrapper, {
  initDaoBuilder,
  pollMainAccount,
  pollNetwork,
  pollConnectivity,
} from './aragonjs-wrapper'
import Wrapper from './Wrapper'
import Onboarding from './onboarding/Onboarding'
import { getWeb3 } from './web3-utils'
import { log } from './utils'

class App extends React.Component {
  static childContextTypes = {
    network: networkContextType,
  }
  state = {
    locator: {},
    prevLocator: null,
    wrapper: null,
    appsLoading: true,
    account: '',
    balance: null,
    network: '',
    connected: false,
    apps: [],
    walletWeb3: null,
    web3: null,
    daoAddress: '',
    daoCreationStatus: 'none', // none / success / error
    buildData: null, // data returned by aragon.js when a DAO is created
    transactionBag: null,
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

    pollNetwork(web3Providers.wallet, network => {
      this.setState({ network })
    })

    // Only the default, because the app can work without the wallet
    pollConnectivity([web3Providers.default], connected => {
      this.setState({ connected })
    })
  }

  getChildContext() {
    return { network }
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
      this.cancelWrapperSubscriptions()
      this.updateDao(locator.dao)
    }

    // Moving from a DAO to somewhere else (like onboarding):
    // need to cancel the subscribtions.
    if (!locator.dao && prevLocator && prevLocator.dao) {
      this.cancelWrapperSubscriptions()
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

  cancelWrapperSubscriptions() {
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }
  }

  updateDao(dao) {
    this.setState({ appsLoading: true })

    log('Wrapper init', dao)
    initWrapper(dao, contractAddresses.ensRegistry, {
      provider: web3Providers.default,
      walletProvider: web3Providers.wallet,
      onError: err => {
        log(`Wrapper init error: ${err.name}. ${err.message}.`)
        this.setState({ appsLoading: false })
      },
      onDaoAddress: daoAddress => {
        log('daoAddress', daoAddress)
        this.setState({ daoAddress })
      },
      onWeb3: web3 => {
        log('web3', web3)
        this.setState({ web3 })
      },
      onApps: (appsWithFrontend, apps) => {
        log('apps received', appsWithFrontend)
        this.setState({ apps: appsWithFrontend, appsLoading: !apps })
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
        console.error('Wrapper init error:', err)
      })
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
      locator,
      wrapper,
      apps,
      account,
      balance,
      network,
      transactionBag,
      daoBuilder,
      daoCreationStatus,
      walletWeb3,
      web3,
      connected,
      daoAddress,
      appsLoading,
    } = this.state
    const { mode } = locator
    if (!mode) return null
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <Wrapper
          historyBack={this.historyBack}
          historyPush={this.historyPush}
          locator={locator}
          wrapper={wrapper}
          apps={apps}
          appsLoading={appsLoading}
          account={account}
          network={network}
          walletWeb3={walletWeb3}
          web3={web3}
          daoAddress={daoAddress}
          transactionBag={transactionBag}
          connected={connected}
        />
        <Onboarding
          visible={mode === 'home' || mode === 'setup'}
          account={account}
          balance={balance}
          network={network}
          onBuildDao={this.handleBuildDao}
          daoBuilder={daoBuilder}
          daoCreationStatus={daoCreationStatus}
          onComplete={this.handleCompleteOnboarding}
          onOpenOrganization={this.handleOpenOrganization}
          onResetDaoBuilder={this.handleResetDaoBuilder}
        />
      </AragonApp>
    )
  }
}

export default App
