import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Badge } from '@aragon/ui'
import { Apps, Permissions, Settings } from './apps'
import springs from './springs'
import ethereumLoadingAnimation from './assets/ethereum-loading.svg'
import { ScreenSizeConsumer, SMALL } from './contexts/ScreenSize'
import AppIFrame from './components/App/AppIFrame'
import App404 from './components/App404/App404'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import SignerPanel from './components/SignerPanel/SignerPanel'
import DeprecatedBanner from './components/DeprecatedBanner/DeprecatedBanner'
import { DaoAddressType } from './prop-types'
import { getAppPath } from './routing'
import { staticApps } from './static-apps'
import { addressesEqual } from './web3-utils'
import { noop } from './utils'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from './symbols'
import {
  NotificationHub,
  Notification,
} from './components/Notifications/NotificationsHub'

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
    daoAddress: DaoAddressType.isRequired,
    historyBack: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    locator: PropTypes.object.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
    permissionsLoading: PropTypes.bool.isRequired,
    screenSize: PropTypes.symbol.isRequired,
    transactionBag: PropTypes.object,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object,
    walletProviderId: PropTypes.string,
    wrapper: PropTypes.object,
    onRequestEnable: PropTypes.func,
  }

  static defaultProps = {
    account: '',
    apps: [],
    banner: null,
    connected: false,
    daoAddress: '',
    historyBack: noop,
    historyPush: noop,
    locator: {},
    onRequestEnable: noop,
    transactionBag: null,
    walletNetwork: '',
    walletProviderId: '',
    walletWeb3: null,
    wrapper: null,
  }
  state = {
    appInstance: {},
    menuPanelOpened: this.props.screenSize !== SMALL,
    notificationOpen: false,
    notifications: [],
    queuedNotifications: [],
  }
  openApp = (instanceId, params) => {
    if (this.props.screenSize === SMALL) {
      this.handleMenuPanelClose()
    }

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
  handleAppMessage = ({ data: { name, value } }) => {
    if (name === 'menuPanel') {
      this.setState({ menuPanelOpened: Boolean(value) })
    }
  }
  handleMenuPanelClose = () => {
    this.setState({ menuPanelOpened: false })
  }
  handleNotificationPanelClose = () => {
    this.setState({ notificationOpen: false })
  }
  handleNotificationsClearAll = () => {
    const { wrapper } = this.props
    wrapper && wrapper.clearNotifications()
  }
  handleNotificationClicked = () => {
    if (this.notificationPanelTimeout)
      clearTimeout(this.notificationPanelTimeout)

    this.setState(state => ({ notificationOpen: !state.notificationOpen }))
  }

  // params need to be a string
  handleParamsRequest = params => {
    this.openApp(this.props.locator.instanceId, params)
  }

  handleNotificationsCleared = e => {
    e.preventDefault()
    this.setState({ notifications: [], queuedNotifications: [] })
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
    } = this.props
    const { menuPanelOpened } = this.state

    const notificationCount = this.state.notifications.length

    return (
      <Main>
        <BannerWrapper>{banner}</BannerWrapper>
        <Container>
          <MenuPanel
            apps={apps.filter(app => app.hasWebApp)}
            appsStatus={appsStatus}
            activeInstanceId={locator.instanceId}
            connected={connected}
            notifications={notificationCount}
            daoAddress={daoAddress}
            menuPanelOpened={menuPanelOpened}
            onOpenApp={this.openApp}
            onCloseMenuPanel={this.handleMenuPanelClose}
            onRequestAppsReload={onRequestAppsReload}
            onNotificationClicked={this.handleNotificationClicked}
            notificationOpen={this.state.notificationOpen}
          />
          <AppScreen>
            <Spring
              native
              from={{ x: -300 }}
              to={{ x: this.state.notificationOpen ? 0 : -300 }}
              config={springs.lazy}
            >
              {props => (
                <NotificationBar
                  tabIndex={0}
                  ref={r => r && this.state.notificationOpen && r.focus()}
                  onBlur={e => {
                    console.log(
                      'NotificationBar.blur, open=',
                      this.state.notificationOpen
                    )
                    if (this.state.notificationOpen)
                      this.handleNotificationPanelClose()
                  }}
                  style={{
                    transform: props.x.interpolate(
                      x => `translate3d(${x}px,0,0)`
                    ),
                  }}
                >
                  <NotificationHeader>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h1 style={{ marginRight: 10 }}>Activity</h1>
                      {notificationCount ? (
                        <Badge.Notification>
                          {notificationCount}
                        </Badge.Notification>
                      ) : null}
                    </div>
                    <a href="#" onClick={this.handleNotificationsCleared}>
                      Clear All
                    </a>
                  </NotificationHeader>
                  <NotificationHub
                    items={this.state.notifications}
                    keys={item => item.id}
                  >
                    {NotificationImpl}
                  </NotificationHub>
                </NotificationBar>
              )}
            </Spring>
            {this.renderApp(locator.instanceId, locator.params)}
          </AppScreen>
        </Container>
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
          connected={connected}
          appsLoading={appsLoading}
          onMessage={this.handleAppMessage}
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
          daoAddress={daoAddress}
          onMessage={this.handleAppMessage}
          onOpenApp={this.openApp}
          walletNetwork={walletNetwork}
          walletWeb3={walletWeb3}
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

/** TODO
 * 1. Click outside should close the panel
 */
const NotificationBar = styled(animated.div)`
  position: absolute;
  width: 254px;
  height: 100%;
  overflow: auto;
  background: #f1f6f8;
  background: #f1f6f8;
  box-shadow: 1px 0 15px 0 #e8e8e8;
  border-right: 1px solid #e8e8e8;
  z-index: 1000;
  outline: 0;
`

const NotificationHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
  & > div > h1 {
    opacity: 0.7;
    font-family: MaisonNeue-Demi;
    font-size: 12px;
    color: #6d777b;
    letter-spacing: 0;
    line-height: 16px;
    text-align: left;
    text-transform: uppercase;
  }
  & > a {
    opacity: 0.9;
    font-family: MaisonNeue-Book;
    font-size: 14px;
    color: #b3b3b3;
    text-align: right;
  }
`

function NotificationImpl(item, ready) {
  let payload =
    typeof item.content === 'string' ? <p>{item.content}</p> : item.content
  switch (item.type) {
    case 'transaction':
      return (
        <Notification.Transaction
          ready={ready}
          title={item.title}
          time="10 min ago"
        >
          {payload}
        </Notification.Transaction>
      )
    default:
      return (
        <Notification ready={ready} title={item.title} time="10 min ago">
          {payload}
        </Notification>
      )
  }
}

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
  <ScreenSizeConsumer>
    {({ screenSize }) => <Wrapper {...props} screenSize={screenSize} />}
  </ScreenSizeConsumer>
)
