import React from 'react'
import styled from 'styled-components'
import { SidePanel } from '@aragon/ui'
import { Permissions, Settings } from './apps'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import ComingSoon from './components/ComingSoon/ComingSoon'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanelContent from './components/SignerPanel/SignerPanelContent'
import { getAppPath, staticApps } from './routing'

import { groups } from './demo-state'

class Wrapper extends React.Component {
  static defaultProps = {
    connected: false,
    wrapper: null,
    walletWeb3: null,
    web3: null,
    locator: {},
    apps: [],
    account: '',
    network: 'private',
    daoAddress: '',
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
    if (transactionBag && transactionBag !== this.props.transactionBag) {
      this.handleTransaction(transactionBag)
    }
  }
  openApp = (appId, params) => {
    const { historyPush, locator } = this.props
    historyPush(getAppPath({ dao: locator.dao, appId: appId, params }))
  }
  handleAppIFrameRef = appIFrame => {
    this.appIFrame = appIFrame
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
    const { transactionBag, walletWeb3 } = this.props
    const { transaction, accept, reject } = transactionBag

    walletWeb3.eth.sendTransaction(transaction, (err, res) => {
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
    const {
      account,
      apps,
      walletWeb3,
      wrapper,
      locator: { appId, params },
    } = this.props
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
            account={account}
            onClose={this.handleSignerClose}
            onSign={this.handleSigningWeb3Tx}
            web3={walletWeb3}
            {...web3Action}
          />
        </SidePanel>
      </React.Fragment>
    )
  }
  renderApp(appId, params) {
    const {
      apps,
      account,
      network,
      wrapper,
      connected,
      daoAddress,
    } = this.props

    if (!wrapper) {
      return <LoadingApps />
    }

    if (appId === 'home') {
      return <Home connected={connected} />
    }

    if (appId === 'permissions') {
      return (
        <ComingSoon
          title="Permissions"
          subtitle={`
            The permissions app is not quite ready for prime time but will be
            available soon.
          `}
        />
      )
      // return (
      //   <Permissions
      //     apps={apps}
      //     groups={groups}
      //     params={params}
      //     onParamsRequest={this.handleParamsRequest}
      //   />
      // )
    }

    if (appId === 'apps') {
      return (
        <ComingSoon
          title="Apps"
          subtitle={`
            The apps manager is not quite ready for prime time but will be
            available soon.
          `}
        />
      )
    }

    if (appId === 'settings') {
      return (
        <Settings
          cache={wrapper.cache}
          daoAddr={daoAddress}
          account={account}
          network={network}
          apps={apps}
        />
      )
    }

    const app = wrapper && apps.find(app => app.appId === appId)

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIFrameRef}
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
