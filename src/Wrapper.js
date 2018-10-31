import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Apps, Permissions, Settings } from './apps'
import ethereumLoadingAnimation from './assets/ethereum-loading.svg'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanel from './components/SignerPanel/SignerPanel'
import DeprecatedBanner from './components/DeprecatedBanner/DeprecatedBanner'
import { getAppPath } from './routing'
import { staticApps } from './static-apps'
import { addressesEqual } from './web3-utils'
import { noop } from './utils'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from './symbols'

class Wrapper extends React.Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    apps: PropTypes.array.isRequired,
    appsStatus: PropTypes.oneOf([
      APPS_STATUS_ERROR,
      APPS_STATUS_READY,
      APPS_STATUS_LOADING,
    ]).isRequired,
    banner: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        type: PropTypes.oneOf([DeprecatedBanner]),
      }),
    ]).isRequired,
    connected: PropTypes.bool.isRequired,
    daoAddress: PropTypes.string.isRequired,
    historyBack: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    locator: PropTypes.object.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
    permissionsLoading: PropTypes.bool.isRequired,
    transactionBag: PropTypes.object,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object,
    wrapper: PropTypes.object,
  }

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

  isAppInstalled(instanceId) {
    const { apps } = this.props
    return (
      staticApps.has(instanceId) &&
      !!apps.find(app => addressesEqual(app.proxyAddress, instanceId))
    )
  }

  render() {
    const {
      account,
      apps,
      walletWeb3,
      walletNetwork,
      wrapper,
      appsStatus,
      locator: { instanceId, params },
      banner,
      onRequestAppsReload,
      transactionBag,
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
        <SignerPanel
          walletWeb3={walletWeb3}
          walletNetwork={walletNetwork}
          transactionBag={transactionBag}
          apps={apps}
          account={account}
        />
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
          account={account}
          apps={apps}
          daoAddr={daoAddress}
          onOpenApp={this.openApp}
          walletNetwork={walletNetwork}
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
