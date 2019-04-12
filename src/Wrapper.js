import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Viewport } from '@aragon/ui'
import { Apps, Permissions, Settings } from './apps'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import Preferences from './components/Preferences/Preferences'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SwipeContainer from './components/MenuPanel/SwipeContainer'
import SignerPanel from './components/SignerPanel/SignerPanel'
import DeprecatedBanner from './components/DeprecatedBanner/DeprecatedBanner'
import NotificationBar from './components/Notifications/NotificationBar'
import {
  AppType,
  AppsStatusType,
  AragonType,
  DaoAddressType,
  EthereumAddressType,
} from './prop-types'
import { getAppPath } from './routing'
import { staticApps } from './static-apps'
import { APPS_STATUS_LOADING } from './symbols'
import { addressesEqual } from './web3-utils'
import ethereumLoadingAnimation from './assets/ethereum-loading.svg'

class Wrapper extends React.PureComponent {
  static propTypes = {
    account: EthereumAddressType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    banner: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        type: PropTypes.oneOf([DeprecatedBanner]),
      }),
    ]),
    connected: PropTypes.bool,
    daoAddress: DaoAddressType.isRequired,
    historyBack: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    locator: PropTypes.object.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
    onRequestEnable: PropTypes.func.isRequired,
    permissionsLoading: PropTypes.bool.isRequired,
    autoClosingPanel: PropTypes.bool.isRequired,
    transactionBag: PropTypes.object,
    walletNetwork: PropTypes.string,
    walletProviderId: PropTypes.string,
    walletWeb3: PropTypes.object,
    wrapper: AragonType,
  }

  static defaultProps = {
    account: '',
    banner: false,
    connected: false,
    transactionBag: null,
    walletNetwork: '',
    walletProviderId: '',
    walletWeb3: null,
  }

  state = {
    appInstance: {},
    menuPanelOpened: !this.props.autoClosingPanel,
    preferencesOpened: false,
    notificationOpen: false,
    notifications: [],
    queuedNotifications: [],
  }

  componentDidUpdate(prevProps) {
    this.updateAutoClosingPanel(prevProps)
  }

  updateAutoClosingPanel(prevProps) {
    const { autoClosingPanel } = this.props
    if (autoClosingPanel !== prevProps.autoClosingPanel) {
      this.setState({ menuPanelOpened: !autoClosingPanel })
      this.sendDisplayMenuButtonStatus()
    }
  }

  sendDisplayMenuButtonStatus() {
    const { autoClosingPanel } = this.props
    if (this.appIFrame) {
      this.appIFrame.sendMessage({
        from: 'wrapper',
        name: 'displayMenuButton',
        value: autoClosingPanel,
      })
    }
  }

  openApp = (instanceId, params) => {
    if (this.props.autoClosingPanel) {
      this.handleMenuPanelClose()
    }

    const { historyPush, locator } = this.props
    historyPush(getAppPath({ dao: locator.dao, instanceId, params }))
  }

  handleAppIFrameRef = appIFrame => {
    this.appIFrame = appIFrame
  }

  handleAppIFrameLoad = async event => {
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

    await wrapper.connectAppIFrame(event.target, instanceId)

    this.appIFrame.sendMessage({
      from: 'wrapper',
      name: 'ready',
      value: true,
    })
    this.sendDisplayMenuButtonStatus()
  }
  handleAppMessage = ({ data: { name, value } }) => {
    if (
      // “menuPanel: Boolean” is deprecated but still supported for a while if
      // value is `true`.
      name === 'menuPanel' ||
      // “requestMenu: true” should now be used.
      name === 'requestMenu'
    ) {
      this.setState({ menuPanelOpened: value === true })
    }
  }
  handleMenuPanelOpen = () => {
    this.setState({ menuPanelOpened: true })
  }
  handleMenuPanelClose = () => {
    this.setState({ menuPanelOpened: false })
  }
  handleNotificationClicked = () => {
    this.setState(state => ({ notificationOpen: !state.notificationOpen }))
  }
  handleClosePreferences = () => {
    this.setState({ preferencesOpened: false })
  }
  handleOpenPreferences = () => {
    if (this.props.autoClosingPanel) {
      this.handleMenuPanelClose()
    }
    this.setState({ preferencesOpened: true })
  }
  // params need to be a string
  handleParamsRequest = params => {
    this.openApp(this.props.locator.instanceId, params)
  }

  handleNotificationsCleared = e => {
    e.preventDefault()
    const { notificationOpen, notifications } = this.state
    this.setState({ notifications: [], queuedNotifications: [] })
    if (notificationOpen) {
      setTimeout(
        () => this.setState({ notificationOpen: false }),
        notifications.length ? 500 : 0
      )
    }
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
      appsStatus,
      autoClosingPanel,
      banner,
      connected,
      daoAddress,
      locator,
      onRequestAppsReload,
      onRequestEnable,
      transactionBag,
      walletNetwork,
      walletProviderId,
      walletWeb3,
      wrapper,
    } = this.props
    const {
      menuPanelOpened,
      notifications,
      notificationOpen,
      preferencesOpened,
    } = this.state

    return (
      <Main>
        <Preferences
          locator={locator}
          opened={preferencesOpened}
          onClose={this.handleClosePreferences}
          wrapper={wrapper}
        />
        <BannerWrapper>{banner}</BannerWrapper>
        <SwipeContainer
          autoClosing={autoClosingPanel}
          menuPanelOpened={menuPanelOpened}
          onMenuPanelClose={this.handleMenuPanelClose}
          onMenuPanelOpen={this.handleMenuPanelOpen}
        >
          {progress => (
            <React.Fragment>
              <MenuPanel
                account={account}
                apps={apps.filter(app => app.hasWebApp)}
                appsStatus={appsStatus}
                activeInstanceId={locator.instanceId}
                connected={connected}
                notifications={notifications.length}
                daoAddress={daoAddress}
                swipeProgress={progress}
                autoClosing={autoClosingPanel}
                onOpenApp={this.openApp}
                onCloseMenuPanel={this.handleMenuPanelClose}
                onOpenPreferences={this.handleOpenPreferences}
                onRequestAppsReload={onRequestAppsReload}
                onRequestEnable={onRequestEnable}
                onNotificationClicked={this.handleNotificationClicked}
                notificationOpen={notificationOpen}
              />
              <AppScreen>
                <NotificationBar
                  open={notificationOpen}
                  notifications={notifications}
                  onClearAll={this.handleNotificationsCleared}
                />
                {this.renderApp(locator.instanceId, locator.params)}
              </AppScreen>
            </React.Fragment>
          )}
        </SwipeContainer>
        <SignerPanel
          account={account}
          apps={apps}
          locator={locator}
          onRequestEnable={onRequestEnable}
          transactionBag={transactionBag}
          walletNetwork={walletNetwork}
          walletProviderId={walletProviderId}
          walletWeb3={walletWeb3}
          onTransactionSuccess={({ data, name, description, identifier }) =>
            this.setState(state => ({
              queuedNotifications: [
                {
                  id: data,
                  type: 'transaction',
                  title: `${name} ${identifier}`,
                  content: description,
                },
                ...state.queuedNotifications,
              ],
            }))
          }
          onClose={() => {
            if (this.state.queuedNotifications.length) {
              // Wait a little, then update notifications
              setTimeout(
                () =>
                  this.setState(state => ({
                    queuedNotifications: [],
                    notifications: [
                      ...state.queuedNotifications,
                      ...state.notifications,
                    ],
                  })),
                250
              )
            }
          }}
        />
      </Main>
    )
  }
  renderApp(instanceId, params) {
    const {
      account,
      apps,
      appsStatus,
      connected,
      daoAddress,
      locator,
      permissionsLoading,
      walletNetwork,
      walletWeb3,
      wrapper,
    } = this.props

    const appsLoading = appsStatus === APPS_STATUS_LOADING

    if (instanceId === 'home') {
      return (
        <Home
          apps={apps}
          appsLoading={appsLoading}
          connected={connected}
          locator={locator}
          onMessage={this.handleAppMessage}
          onOpenApp={this.openApp}
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
          onMessage={this.handleAppMessage}
          onParamsRequest={this.handleParamsRequest}
        />
      )
    }

    if (instanceId === 'apps') {
      return <Apps onMessage={this.handleAppMessage} />
    }

    if (instanceId === 'settings') {
      return (
        <Settings
          account={account}
          apps={apps}
          appsLoading={appsLoading}
          daoAddress={daoAddress}
          onMessage={this.handleAppMessage}
          onOpenApp={this.openApp}
          walletNetwork={walletNetwork}
          walletWeb3={walletWeb3}
          wrapper={wrapper}
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
        onMessage={this.handleAppMessage}
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
  min-width: 320px;
`

const BannerWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
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

export default props => (
  <Viewport>
    {({ below }) => <Wrapper {...props} autoClosingPanel={below('medium')} />}
  </Viewport>
)
