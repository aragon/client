import Web3 from 'web3'
import React from 'react'
import createHistory from 'history/createHashHistory'
import { AragonApp } from '@aragon/ui'
import { parsePath } from './routing'
import initWrapper from './aragonjs-wrapper'
import Wrapper from './Wrapper'

// TODO: make these depend on the env / URL
const PROVIDER = new Web3.providers.WebsocketProvider('ws://localhost:8545')
const WALLET_PROVIDER = window.web3.currentProvider
const ENS = '0x409ba3dd291bb5d48d5b4404f5efa207441f6cba'

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

    // New DAO: need to reinit the wrapper
    if (locator.dao && (!prevLocator || locator.dao !== prevLocator.dao)) {
      this.setState({ dao: locator.dao })
      this.updateDao(locator.dao)
    }

    this.setState({ locator, prevLocator })
  }

  updateDao = dao => {
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }
    console.log('init the wrapper', dao)
    initWrapper(dao, ENS, {
      provider: PROVIDER,
      walletProvider: WALLET_PROVIDER,
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
        {mode === 'app' && (
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
        )}
        {(mode === 'home' || mode === 'setup') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: '1.8',
            }}
          >
            Pass the DAO address in the URL, e.g.<br />
            <code>
              {`${window.location.protocol}//${
                window.location.host
              }/#/0x6fe95e08427f67c917f5fe2a158f3bf203ff4559`}
            </code>
          </div>
        )}
      </AragonApp>
    )
  }
}

export default App
