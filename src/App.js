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
const DAO = '0xc134cd72e5cb1a73ea7bc303981e7047c67f2d5c'
const ENS = '0xbed25629e2385ba897291eb7d248829e01370bc6'
const PROVIDER = new Web3.providers.WebsocketProvider('ws://localhost:8545')

class App extends React.Component {
  state = {
    apps: [],
    wrapper: null,
    appInstance: {},
    lastPath: '',
    path: '',
    search: '',
    notifications,
    signerOpened: false,
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
    this.state.apps = this.getCache().apps || []

    // TODO: initialize web3 instance with browser-provided provider
    this.web3 = {}

    initWrapper(DAO, ENS, { provider: PROVIDER }).then(wrapper => {
      this.setState({ wrapper })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateWrapper(prevState.wrapper, this.state.wrapper)
  }

  // Update the aragon.js wrapper with a new instance
  updateWrapper(prevWrapper, wrapper) {
    if (prevWrapper === wrapper) {
      return
    }

    // Remove any previous subscription
    if (this.appsSubscription) {
      this.appsSubscription.unsubscribe()
      delete this.appsSubscription
    }

    if (wrapper && wrapper.apps) {
      this.appsSubscription = wrapper.apps.subscribe(this.handleReceiveApps)
    }
  }

  handleReceiveApps = apps => {
    // TODO: detect apps without UI and remove the exception for "Vault"
    const menuApps = apps
      .filter(app => app.content && app.name !== 'Vault')
      .map(app => ({ ...app, appSrc: this.getAppSrc(app) }))
    this.setCache({ apps: menuApps })
    this.setState({ apps: menuApps })
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
  getCache(obj) {
    return JSON.parse(localStorage.getItem('wrapper-cache') || '{}')
  }
  setCache(obj) {
    localStorage.setItem('wrapper-cache', JSON.stringify(obj))
  }

  getAppSrc(app = {}) {
    const hash = app.content && app.content.location
    if (!hash) return ''

    // TODO: move this in the env settings
    // This is the Voting app hash in the dev template
    if (hash === 'QmV5sEjshcZ6mu6uFUhJkWM5nTa53wbHfRFDD4Qy2Yx88m') {
      return 'http://localhost:3001/'
    }

    return `https://gateway.ipfs.io/ipfs/${hash}/`
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
  handleSignerClose = () => {
    this.setState({
      signerOpened: false,
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
  handleSigningWeb3Tx = ({ data, from, to }) => {
    // TODO: handle web3 signing before reseting signing state
    Promise.resolve().then(this.handleSignerClose)
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
      apps,
      notifications,
      signerOpened,
      web3Action,
      appInstance: { appId, instanceId, params },
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
            web3={this.web3}
            {...web3Action}
          />
        </SidePanel>
      </AragonApp>
    )
  }
  renderApp(appId, params) {
    const { apps, wrapper } = this.state

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

    const app = apps.find(app => app.appId === appId)
    return app ? (
      <AppIFrame src={app.appSrc} wrapper={wrapper} app={app} />
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
