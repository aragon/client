import React from 'react'
import styled from 'styled-components'
import { SidePanel } from '@aragon/ui'
import { Permissions, Settings } from './apps'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanelContent from './components/SignerPanel/SignerPanelContent'
import { getAppPath, staticApps } from './routing'

import { tokens, prices, groups, homeActions } from './demo-state'

class Wrapper extends React.Component {
  static defaultProps = {
    wrapper: null,
    web3: null,
    locator: {},
    apps: [],
    account: '',
    transactionBag: null,
    historyBack: () => {},
    historyPush: () => {},
  }
  state = {
    appInstance: {},
    signerOpened: false,
    web3Action: {},
  }
  componentWillReceiveProps({ account, transactionBag }) {
    if (account && account !== this.props.account) {
      this.sendAccountToApp(account)
    }
    if (transactionBag && transactionBag !== this.props.transactionBag) {
      this.handleTransaction(transactionBag)
    }
  }
  openApp = (appId, params) => {
    const { historyPush, locator } = this.props
    historyPush(getAppPath({ dao: locator.dao, appId: appId, params }))
  }
  sendAccountToApp = account => {
    if (this.appIFrame) {
      this.appIFrame.sendMessage({
        from: 'wrapper',
        name: 'account',
        value: account,
      })
    }
  }
  handleAppIFrameRef = appIFrame => {
    this.appIFrame = appIFrame
    this.sendAccountToApp()
  }
  handleAppIFrameMessage = ({ data }) => {
    if (data.from !== 'app') return
    if (data.name === 'ready') {
      this.sendAccountToApp()
    }
  }
  handleAppIFrameLoad = event => {
    const { apps, wrapper, locator: { appId } } = this.props
    const app = wrapper && apps.find(app => app.appId === appId)

    if (!app || !wrapper) {
      console.error('The app cannot be connected to aragon.js')
    }

    wrapper.connectAppIFrame(event.target, app.proxyAddress)
    this.appIFrame.sendMessage({
      from: 'wrapper',
      name: 'ready',
      value: true,
    })
    this.sendAccountToApp()
  }
  handleNotificationsClearAll = () => {
    const { wrapper } = this.props
    wrapper && wrapper.clearNotifications()
  }
  handleNotificationNavigation = ({ context, app: appId }) => {
    console.log(appId, context)
    if (this.isAppInstalled(appId)) {
      this.openApp(appId)
    }
  }
  handleParamsRequest = params => {
    // const { appId, } = this.state.appInstance
    // this.openApp(appId, params)
  }
  handleTransaction = ({ transaction }) => {
    this.showWeb3ActionSigner(
      {
        to: transaction && transaction.to,
        tx: transaction,
        description: transaction && transaction.description,
      },
      { error: null }
    )
  }
  handleSigningWeb3Tx = ({ data, from, to }) => {
    const { transactionBag, web3 } = this.props
    const { transaction, accept, reject } = transactionBag

    web3.eth.sendTransaction(transaction, (err, res) => {
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
    this.setState({ signerOpened: false })
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
    const { apps } = this.props
    return staticApps.has(appId) && !!apps.find(app => app.appId === appId)
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
    const { signerOpened, web3Action } = this.state
    const { apps, web3, wrapper, locator: { appId, params } } = this.props
    return (
      <React.Fragment>
        <Main>
          <MenuPanel
            apps={apps}
            activeAppId={appId}
            activeInstanceId={appId}
            notificationsObservable={wrapper && wrapper.notifications}
            onOpenApp={this.openApp}
            onClearAllNotifications={this.handleNotificationsClearAll}
            onOpenNotification={this.handleNotificationNavigation}
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
            web3={web3}
            {...web3Action}
          />
        </SidePanel>
      </React.Fragment>
    )
  }
  renderApp(appId, params) {
    const { apps, locator, wrapper } = this.props

    if (!wrapper) {
      return <LoadingApps />
    }

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

    if (appId === 'settings') {
      return <Settings cache={wrapper.cache} daoAddr={locator.dao} />
    }

    const app = wrapper && apps.find(app => app.appId === appId)

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIFrameRef}
        onMessage={this.handleAppIFrameMessage}
        onLoad={this.handleAppIFrameLoad}
      />
    ) : apps.length ? (
      <App404 onNavigateBack={this.props.historyBack} />
    ) : (
      <LoadingApps />
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

const LoadingApps = () => <div />

export default Wrapper
