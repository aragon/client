import React from 'react'
import styled from 'styled-components'
import createHistory from 'history/createHashHistory'
import { AragonApp, SidePanel } from '@aragon/ui'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanelContent from './components/SignerPanel/SignerPanelContent'
import Permissions from './apps/Permissions/Permissions'
import initWrapper from './aragonjs-wrapper'
import Web3 from 'web3'

import {
  // actionIntent,
  // actionPaths,
  notifications,
  tokens,
  prices,
  groups,
  homeActions,
} from './demo-state'

// TODO: make these depend on the env / URL
const PROVIDER = new Web3.providers.WebsocketProvider('ws://localhost:8545')
const SIGNING_PROVIDER = window.web3.currentProvider
const DAO = "0x6fe95e08427f67c917f5fe2a158f3bf203ff4559"
const ENS = "0x409ba3dd291bb5d48d5b4404f5efa207441f6cba"

class App extends React.Component {
  state = {
    apps: [],
    appInstance: {},
    lastPath: '',
    path: '',
    search: '',
    notifications,
    signerOpened: false,
    transactionBag: null,
    account: '',
    web3Action: {},
  }
  constructor() {
    super()
    this.history = createHistory()
    this.history.listen(this.handleNavigation)

    const path = this.history.location.pathname
    const search = this.history.location.search || ''
    this.state.path = path
    this.state.search = search
    this.state.appInstance = this.appInstance(path, search)
    this.state.apps = []
  }
  componentDidMount() {
    initWrapper(DAO, ENS, {
      provider: PROVIDER,
      signingProvider: SIGNING_PROVIDER,
      onWrapper: wrapper => {
        this.wrapper = wrapper
      },
      onSigningWeb3: web3 => {
        this.signingWeb3 = web3
      },
      onAccount: account => {
        this.handleAccountChange(account)
      },
      onApps: apps => {
        console.log('apps', apps)
      },
      onMenuApps: menuApps => {
        this.setState({ apps: menuApps })
      },
      onForwarders: forwarders => {
        console.log('forwarders', forwarders)
      },
      onTransaction: this.handleTransaction,
    })
  }
  appInstance(path, search) {
    const matches = path.match(/^\/?(\w+)\/?(\w+)?/)
    if (!matches) {
      return { appId: 'home', instanceId: '' }
    }

    const params = search && search.split('?params=')[1]
    return {
      appId: matches[1],
      instanceId: matches[2],
      params: params ? JSON.parse(decodeURIComponent(params)) : null,
    }
  }
  changePath = (path, search = '') => {
    const { state } = this
    if (path !== state.path || search !== state.search) {
      this.history.push(path + search)
    }
  }
  sendAccountToApp = () => {
    const {account}=this.state
    if (account && this.appIframe) {
      this.appIframe.sendMessage({
        from: 'wrapper',
        name: 'account',
        value: account,
      })
    }
  }
  handleAccountChange = account => {
    this.setState({ account: account || '' }, this.sendAccountToApp)
  }
  handleAppIframeRef = appIframe => {
    this.appIframe = appIframe
    this.sendAccountToApp()
  }
  handleAppIframeMessage = ({data}) => {
    if (data.from !== 'app') return
    if (data.name === 'ready') {
      this.sendAccountToApp()
    }
  }
  handleIframeNavigate = app => {
    if (app && this.wrapper && this.appIframeElt) {
      this.wrapper.runApp(this.appIframeElt.contentWindow, app.proxyAddress)
      this.sendAccountToApp()
    }
  }
  handleNavigateBack = () => {
    this.state.lastPath ? this.history.goBack() : this.history.replace('/')
  }
  handleNavigation = ({ pathname: path, search }) => {
    this.setState({
      path,
      search,
      appInstance: this.appInstance(path, search),
      lastPath: this.state.path,
    })
  }
  handleParamsRequest = params => {
    const { appId, instanceId } = this.state.appInstance
    this.openApp(
      appId,
      instanceId,
      params ? encodeURIComponent(JSON.stringify(params)) : null
    )
  }
  handleTransaction = transactionBag => {
    const { transaction } = transactionBag
    this.setState({ transactionBag }, () => {
      this.showWeb3ActionSigner(
        { to: transaction.to },
        {
          error: null,
          paths: [
            {
              appName: transaction.from,
              description: 'This account can perform the action.',
              tx: transaction,
            },
          ],
        }
      )
    })
  }
  handleSigningWeb3Tx = ({ data, from, to }) => {
    const { transactionBag } = this.state
    const { transaction, accept, reject } = transactionBag
    this.signingWeb3.eth.sendTransaction(transaction, (err, res) => {
      this.handleSignerClose()

      if (err) {
        this.showWeb3ActionSigner({ to: transaction.to }, { error: err })
        reject(err)
        console.error(err)
        return
      }

      accept(res)
    })
  }
  handleSignerClose = () => {
    this.setState({
      signerOpened: false,
      transactionBag: null,
    })
  }
  handleSignerTransitionEnd = opened => {
    // Reset signer state only after it has finished transitioning out
    if (!opened) {
      this.setState({
        web3Action: {},
      })
    }
  }
  isAppInstalled(appId) {
    const { apps } = this.state
    return (
      appId === 'home' ||
      appId === 'permissions' ||
      appId === 'settings' ||
      !!apps.find(app => app.appId === appId)
    )
  }
  openApp = (appId, instanceId, params) => {
    if (appId === 'home') {
      this.changePath('/')
      return
    }

    if (appId === 'settings') {
      this.changePath('/settings')
      return
    }

    // Get the first instance found if instanceId is not passed
    const { apps } = this.state
    const app = apps.find(app => app.appId === appId)

    const instances = (app && app.instances) || []
    const instance = instanceId
      ? instances.find(({ id }) => id === instanceId)
      : instances[0]

    this.changePath(
      `/${appId}${instance ? `/${instance.id}` : ''}`,
      params ? `?params=${params}` : ''
    )
  }
  showWeb3ActionSigner = (intent, { error, paths }) => {
    this.setState({
      signerOpened: true,
      web3Action: {
        error,
        intent,
        paths,
      },
    })
  }
  render() {
    const {
      appInstance: { appId, instanceId, params },
      apps,
      notifications,
      signerOpened,
      web3Action,
    } = this.state
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <Main>
          <MenuPanel
            apps={apps}
            activeAppId={appId}
            activeInstanceId={instanceId}
            notifications={notifications}
            onOpenApp={this.openApp}
          />
          <AppScreen>{this.renderApp(appId, params)}</AppScreen>
        </Main>
        <SidePanel
          onClose={this.handleSignerClose}
          onTransitionEnd={this.handleSignerTransitionEnd}
          opened={signerOpened}
          title="Sign Transaction"
        >
          <SignerPanelContent
            onClose={this.handleSignerClose}
            onSign={this.handleSigningWeb3Tx}
            web3={this.signingWeb3}
            {...web3Action}
          />
        </SidePanel>
      </AragonApp>
    )
  }
  renderApp(appId, params) {
    const { apps } = this.state

    if (appId === 'home') {
      return (
        <Home
          tokens={tokens}
          prices={prices}
          actions={homeActions}
          onOpenApp={this.openApp}
        />
      )
    }

    if (appId === 'permissions') {
      return (
        <Permissions
          apps={apps}
          groups={groups}
          params={params}
          onParamsRequest={this.handleParamsRequest}
        />
      )
    }

    const app = this.wrapper && apps.find(app => app.appId === appId)

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIframeRef}
        iframeRef={iframe => (this.appIframeElt = iframe)}
        onNavigate={this.handleIframeNavigate}
        onMessage={this.handleAppIframeMessage}
      />
    ) : (
      <App404 onNavigateBack={this.handleNavigateBack} />
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: stretch;
  height: 100vh;
`

const AppScreen = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
`

export default App
