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
} from './aragonjs-wrapper'
import Wrapper from './Wrapper'
import Onboarding from './onboarding/Onboarding'

class App extends React.Component {
  static childContextTypes = {
    network: networkContextType,
  }
  state = {
    locator: {},
    prevLocator: null,
    wrapper: null,
    account: '',
    balance: null,
    network: '',
    apps: [],
    web3: null,
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

    pollMainAccount(web3Providers.wallet, (account = null, balance) => {
      this.setState({ account, balance })
      if (account && this.state.wrapper) {
        this.state.wrapper.setAccounts([account])
      }
    })

    pollNetwork(web3Providers.wallet, network => {
      this.setState({ network })
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
      this.updateDao(locator.dao)
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
      console.log('DAO created', dao, token, domain)
    } catch (err) {
      console.log(err)
      this.setState({ daoCreationStatus: 'error' })
    }
  }

  updateDao(dao) {
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }
    console.log('Wrapper init', dao)
    initWrapper(dao, contractAddresses.ensRegistry, {
      provider: web3Providers.default,
      walletProvider: web3Providers.wallet,
      onError: name => {
        if (name === 'NO_CONNECTION') {
          console.log('No Ethereum connection detected.')
        }
      },
      onWeb3: web3 => {
        console.log('web3', web3)
        this.setState({ web3 })
      },
      onApps: apps => {
        console.log('apps', apps)
        this.setState({ apps })
      },
      onForwarders: forwarders => {
        console.log('forwarders', forwarders)
      },
      onTransaction: transactionBag => {
        console.log('transaction bag', transactionBag)
        this.setState({ transactionBag })
      },
    })
      .then(wrapper => {
        console.log('wrapper', wrapper)
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
      web3,
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
          account={account}
          web3={web3}
          transactionBag={transactionBag}
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
        />
      </AragonApp>
    )
  }
}

export default App
