import React from 'react'
import createHistory from 'history/createHashHistory'
import { AragonApp } from '@aragon/ui'
import { addresses, web3Providers } from './environment'
import { parsePath } from './routing'
import initWrapper, { initDaoBuilder } from './aragonjs-wrapper'
import Wrapper from './Wrapper'
import Onboarding from './onboarding/Onboarding'

class App extends React.Component {
  state = {
    locator: {},
    prevLocator: null,
    wrapper: null,
    account: '',
    apps: [],
    web3: null,
    transactionBag: null,
  }

  history = createHistory()

  componentDidMount() {
    const { pathname, search } = this.history.location
    this.handleHistoryChange({ pathname, search })
    this.history.listen(this.handleHistoryChange)
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
    console.log('locator', locator)
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
      addresses.ensRegistry
    )
    this.setState({ daoBuilder })

    // DEV: Create a DAO immediately
    const dao = await daoBuilder('democracy', 'blablabla', {
      holders: [
        { address: '0xaEE8fC07eAF332b920A219A5888C0cd6891E26C5', balance: 1 },
      ],
      supportNeeded: 0.2,
      minAcceptanceQuorum: 0.2,
      voteDuration: 40,
    })

    console.log({dao})
  }

  handleBuildDao = (templateName, organizationName, data) => {
    const { daoBuilder } = this.state
    daoBuilder(templateName, organizationName, data)
    console.log('BUILD DAO', data)
  }

  updateDao(dao) {
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }
    console.log('init the wrapper', dao)
    initWrapper(dao, addresses.ensRegistry, {
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
      onAccounts: accounts => {
        const account = accounts[0]
        if (this.state.account === account) {
          return
        }
        console.log('account', account)
        this.setState({ account })
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
    }).then(wrapper => {
      console.log('wrapper', wrapper)
      this.setState({ wrapper })
    })
  }

  render() {
    const { locator, wrapper, apps, account, transactionBag } = this.state
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
          web3={window.web3}
          transactionBag={transactionBag}
        />
        <Onboarding
          visible={mode === 'home' || mode === 'setup'}
          onBuildDao={this.handleBuildDao}
          onComplete={() => {
            // this.historyPush('/0x6fe95e08427f67c917f5fe2a158f3bf203ff4559')
          }}
        />
      </AragonApp>
    )
  }
}

export default App
