import React from 'react'
import styled from 'styled-components'
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
    notifications,
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
  handleParamsRequest = params => {
    // const { appId, } = this.state.appInstance
    // this.openApp(appId, params)
  }
  handleTransaction = ({ transaction }) => {
    this.showWeb3ActionSigner(
      {
        to: transaction.to,
        tx: transaction,
        description: transaction.description,
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
    const { apps, web3, locator: { appId, params } } = this.props
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
            web3={web3}
            {...web3Action}
          />
        </SidePanel>
      </React.Fragment>
    )
  }
  renderApp(appId, params) {
    const { apps, wrapper } = this.props

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

    const app = wrapper && apps.find(app => app.appId === appId)

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIFrameRef}
        onMessage={this.handleAppIFrameMessage}
        onLoad={this.handleAppIFrameLoad}
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
