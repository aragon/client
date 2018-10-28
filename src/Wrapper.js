import React from 'react'
import styled from 'styled-components'
import { SidePanel } from '@aragon/ui'
import { Apps, Permissions, Settings } from './apps'
import ethereumLoadingAnimation from './assets/ethereum-loading.svg'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanelContent from './components/SignerPanel/SignerPanelContent'
import { getAppPath } from './routing'
import { staticApps } from './static-apps'
import { addressesEqual } from './web3-utils'
import { noop } from './utils'
import { APPS_STATUS_LOADING } from './symbols'

class Wrapper extends React.Component {
  static defaultProps = {
    apps: [],
    account: '',
    connected: false,
    daoAddress: '',
    historyBack: noop,
    historyPush: noop,
    locator: {},
    walletNetwork: '',
    transactionBag: null,
    wrapper: null,
    walletWeb3: null,
    web3: null,
    banner: null,
  }
  state = {
    appInstance: {},
    signerOpened: false,
    web3Action: {},
  }
  componentWillReceiveProps({ transactionBag }) {
    if (transactionBag && transactionBag !== this.props.transactionBag) {
      this.handleTransaction(transactionBag)
    }
  }
  openApp = (instanceId, params) => {
    const { historyPush, locator } = this.props
    historyPush(getAppPath({ dao: locator.dao, instanceId, params }))
  }
  handleAppIFrameRef = appIFrame => {
    this.appIFrame = appIFrame
  }
  handleAppIFrameLoad = event => {
    const {
      apps,
      wrapper,
      locator: { instanceId },
    } = this.props
    if (
      !wrapper ||
      !apps.find(app => addressesEqual(app.proxyAddress, instanceId))
    ) {
      console.error('The app cannot be connected to aragon.js')
      return
    }

    wrapper.connectAppIFrame(event.target, instanceId)
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
  handleNotificationNavigation = ({ context, app: instanceId }) => {
    if (this.isAppInstalled(instanceId)) {
      this.openApp(instanceId)
    }
  }
  // params need to be a string
  handleParamsRequest = params => {
    this.openApp(this.props.locator.instanceId, params)
  }
  makeTransactionIntent({ path, transaction = {} }) {
    if (path.length > 1) {
      // If the path includes forwarders, the intent is always the last node
      const { description, name, to } = path[path.length - 1]
      return {
        description,
        name,
        to,
        transaction: transaction,
      }
    } else {
      // Direct path
      const { apps } = this.props
      const { description, to } = transaction
      const toApp = apps.find(app => addressesEqual(app.proxyAddress, to))
      const name = (toApp && toApp.name) || ''

      return {
        description,
        name,
        to,
        transaction,
      }
    }
  }
  reshapeTransactionBag(bag) {
    // This is a temporary method to reshape the transaction bag
    // to the future format we expect from Aragon.js
    // When Aragon.js starts returning the new format, we can simply
    // replace search and replace this function with `bag`, although
    // it is probably only used in `handleTransaction`
    const { path, transaction } = bag
    return {
      direct: path.length === 1,
      intent: transaction && this.makeTransactionIntent(bag),
      paths: path.length ? [path] : [],
      pretransaction: (transaction && transaction.pretransaction) || null,
    }
  }
  handleTransaction = bag => {
    const {
      intent,
      direct,
      paths,
      pretransaction,
    } = this.reshapeTransactionBag(bag)
    this.showWeb3ActionSigner(intent, {
      direct,
      error: null,
      paths,
      pretransaction,
    })
  }

  async signWeb3Tx(transaction, intent) {
    const { walletWeb3 } = this.props
    return new Promise((resolve, reject) => {
      walletWeb3.eth.sendTransaction(transaction, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  handleSigningWeb3Tx = async (transaction, intent, pretransaction) => {
    const { transactionBag } = this.props

    try {
      if (pretransaction) {
        await this.signWeb3Tx(pretransaction, intent)
      }

      const transactionRes = await this.signWeb3Tx(transaction, intent)

      transactionBag.accept(transactionRes)
      this.handleSignerClose()

      // Display an error in the panel if a transaction fail
    } catch (err) {
      console.error(err)
      transactionBag.reject(err)
      this.handleSignerClose()
      this.showWeb3ActionSigner(intent, { error: err })
    }
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
  isAppInstalled(instanceId) {
    const { apps } = this.props
    return (
      staticApps.has(instanceId) &&
      !!apps.find(app => addressesEqual(app.proxyAddress, instanceId))
    )
  }
  showWeb3ActionSigner = (intent, { direct, error, paths, pretransaction }) => {
    this.setState({
      signerOpened: true,
      web3Action: {
        error,
        intent,
        paths,
        direct,
        pretransaction,
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
      appsStatus,
      locator: { instanceId, params },
      banner,
      onRequestAppsReload,
    } = this.props

    return (
      <Main>
        <BannerWrapper>{banner}</BannerWrapper>
        <Container>
          <MenuPanel
            apps={apps.filter(app => app.hasWebApp)}
            appsStatus={appsStatus}
            activeInstanceId={instanceId}
            notificationsObservable={wrapper && wrapper.notifications}
            onOpenApp={this.openApp}
            onClearAllNotifications={this.handleNotificationsClearAll}
            onOpenNotification={this.handleNotificationNavigation}
            onRequestAppsReload={onRequestAppsReload}
          />
          <AppScreen>{this.renderApp(instanceId, params)}</AppScreen>
        </Container>
        <SidePanel
          onClose={this.handleSignerClose}
          onTransitionEnd={this.handleSignerTransitionEnd}
          opened={signerOpened}
          title="Create transaction"
        >
          <SignerPanelContent
            account={account}
            onClose={this.handleSignerClose}
            onSign={this.handleSigningWeb3Tx}
            web3={walletWeb3}
            {...web3Action}
          />
        </SidePanel>
      </Main>
    )
  }
  renderApp(instanceId, params) {
    const {
      locator,
      apps,
      appsStatus,
      permissionsLoading,
      account,
      walletNetwork,
      walletWeb3,
      wrapper,
      connected,
      daoAddress,
    } = this.props

    const appsLoading = appsStatus === APPS_STATUS_LOADING

    if (instanceId === 'home') {
      return (
        <Home
          connected={connected}
          appsLoading={appsLoading}
          onOpenApp={this.openApp}
          locator={locator}
          apps={apps}
        />
      )
    }

    if (instanceId === 'permissions') {
      return (
        <Permissions
          apps={apps}
          appsLoading={appsLoading}
          permissionsLoading={permissionsLoading}
          params={params}
          onParamsRequest={this.handleParamsRequest}
          walletWeb3={walletWeb3}
          account={account}
          wrapper={wrapper}
        />
      )
    }

    if (instanceId === 'apps') {
      return <Apps />
    }

    if (instanceId === 'settings') {
      return (
        <Settings
          daoAddr={daoAddress}
          account={account}
          walletNetwork={walletNetwork}
          apps={apps}
        />
      )
    }

    if (!wrapper || appsLoading) {
      return <LoadingApps />
    }

    const app = apps.find(app => addressesEqual(app.proxyAddress, instanceId))

    return app ? (
      <AppIFrame
        app={app}
        ref={this.handleAppIFrameRef}
        onLoad={this.handleAppIFrameLoad}
      />
    ) : (
      <App404 onNavigateBack={this.props.historyBack} />
    )
  }
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const BannerWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`

const Container = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  min-height: 0;
`

const AppScreen = styled.div`
  position: relative;
  z-index: 1;
  flex-grow: 1;
  overflow: auto;
`

const LoadingAnimation = styled.img`
  display: block;
  margin-bottom: 32px;
`

const LoadingApps = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flexDirection: 'column',
    }}
  >
    <LoadingAnimation src={ethereumLoadingAnimation} />
    Loading apps…
  </div>
)

export default Wrapper
