import React from 'react'
import styled from 'styled-components'
import { providers } from '@aragon/messenger'
import { SidePanel } from '@aragon/ui'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanelContent from './components/SignerPanel/SignerPanelContent'
import Permissions from './apps/Permissions/Permissions'
import { getAppPath } from './routing'

import {
  notifications,
  tokens,
  prices,
  groups,
  homeActions,
} from './demo-state'

const { WindowMessage } = providers

class Wrapper extends React.Component {
  static defaultProps = {
    wrapper: null,
    locator: {},
    apps: [],
    account: '',
    historyBack: () => {},
    historyPush: () => {},
  }
  state = {
    appInstance: {},
    notifications,
    signerOpened: false,
    transactionBag: null,
    web3Action: {},
  }
  componentWillReceiveProps({ account }) {
    if (account && account !== this.props.account) {
      console.log('account', account)
      this.sendAccountToApp(account)
    }
  }
  openApp = (appId, params) => {
    console.log('open app', appId, params)

    const { historyPush, locator } = this.props
    historyPush(getAppPath({ dao: locator.dao, appId: appId, params }))
  }
  sendAccountToApp = account => {
    if (this.appIframe) {
      this.appIframe.sendMessage({
        from: 'wrapper',
        name: 'account',
        value: account,
      })
    }
  }
  handleAppIframeRef = appIframe => {
    this.appIframe = appIframe
    this.sendAccountToApp()
  }
  handleAppIframeMessage = ({ data }) => {
    if (data.from !== 'app') return
    if (data.name === 'ready') {
      this.sendAccountToApp()
    }
  }
  handleIframeNavigate = app => {
    if (app && this.props.wrapper && this.appIframeElt) {
      this.props.wrapper.runApp(
        WindowMessage(this.appIframeElt.contentWindow),
        app.proxyAddress
      )
      this.sendAccountToApp()
    }
  }
  handleParamsRequest = params => {
    // const { appId, } = this.state.appInstance
    // this.openApp(appId, params)
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
    const { apps } = this.props
    return (
      appId === 'home' ||
      appId === 'permissions' ||
      appId === 'settings' ||
      !!apps.find(app => app.appId === appId)
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
    const { notifications, signerOpened, web3Action } = this.state
    const { apps, locator: { appId, params } } = this.props
    return (
      <React.Fragment>
        <Main>
          <MenuPanel
            apps={apps}
            activeAppId={appId}
            activeInstanceId={appId}
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
      </React.Fragment>
    )
  }
  renderApp(appId, params) {
    const { apps } = this.props

    console.log('APPID', appId)

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

    const app = this.props.wrapper && apps.find(app => app.appId === appId)

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIframeRef}
        iframeRef={iframe => (this.appIframeElt = iframe)}
        onNavigate={this.handleIframeNavigate}
        onMessage={this.handleAppIframeMessage}
      />
    ) : (
      <App404 onNavigateBack={this.props.historyBack} />
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

export default Wrapper
