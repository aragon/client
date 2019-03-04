import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import {
  Button,
  IconSettings,
  Text,
  Viewport,
  breakpoint,
  springs,
  theme,
  unselectable,
} from '@aragon/ui'
import memoize from 'lodash.memoize'
import { appIconUrl } from '../../utils'
import { AppType, AppsStatusType, DaoAddressType } from '../../prop-types'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import RemoteIcon from '../RemoteIcon'
import NotificationAlert from '../Notifications/NotificationAlert'
import OrganizationSwitcher from './OrganizationSwitcher/OrganizationSwitcher'

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_PERMISSIONS = staticApps.get('permissions').app
const APP_SETTINGS = staticApps.get('settings').app
const SHADOW_WIDTH = 15

const prepareAppGroups = apps =>
  apps.reduce((groups, app) => {
    const group = groups.find(({ appId }) => appId === app.appId)
    const instance = { ...app, instanceId: app.proxyAddress }

    // Append the instance to the existing app group
    if (group) {
      group.instances.push(instance)
      return groups
    }

    return groups.concat([
      {
        appId: app.appId,
        name: app.name,
        icon: <RemoteIcon src={appIconUrl(app)} size={22} />,
        instances: [instance],
      },
    ])
  }, [])

class MenuPanel extends React.PureComponent {
  static propTypes = {
    activeInstanceId: PropTypes.string,
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    connected: PropTypes.bool.isRequired,
    daoAddress: DaoAddressType.isRequired,
    notifications: PropTypes.number,
    onOpenApp: PropTypes.func.isRequired,
    onOpenPreferences: PropTypes.func.isRequired,
    onNotificationClicked: PropTypes.func.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
  }

  state = {
    notifications: [],
  }

  getAppGroups = memoize(apps => prepareAppGroups(apps))

  render() {
    const {
      apps,
      connected,
      daoAddress,
      onNotificationClicked,
      onOpenPreferences,
      notifications,
    } = this.props
    const appGroups = this.getAppGroups(apps)

    const menuApps = [
      APP_HOME,
      appGroups,
      APP_PERMISSIONS,
      APP_APPS_CENTER,
      APP_SETTINGS,
    ]

    return (
      <Main>
        <In>
          <Header>
            <OrganizationSwitcher
              currentDao={{
                name: daoAddress.domain,
                address: daoAddress.address,
              }}
            />
            <NotificationAlert
              notifications={notifications}
              onClick={onNotificationClicked}
            />
          </Header>
          <Content>
            <div className="in">
              <h1>Apps</h1>
              <div>
                {menuApps.map(app =>
                  // If it's an array, it's the group being loaded from the ACL
                  Array.isArray(app)
                    ? this.renderLoadedAppGroup(app)
                    : this.renderAppGroup(app, false)
                )}
              </div>
            </div>
          </Content>
          <ConnectionWrapper>
            <ConnectionBullet connected={connected} />
            <Text size="xsmall">
              {connected ? 'Connected to the network' : 'Not connected'}
            </Text>
          </ConnectionWrapper>
          <StyledPreferencesButton
            mode="outline"
            label="My preferences"
            onClick={onOpenPreferences}
          >
            <IconSettings /> My preferences
          </StyledPreferencesButton>
        </In>
      </Main>
    )
  }

  renderAppGroup(app) {
    const { activeInstanceId, onOpenApp } = this.props

    const { appId, name, icon, instances = [] } = app
    const isActive =
      instances.findIndex(
        ({ instanceId }) => instanceId === activeInstanceId
      ) !== -1

    return (
      <div key={appId}>
        <MenuPanelAppGroup
          name={name}
          icon={icon}
          instances={instances}
          active={isActive}
          expand={isActive}
          activeInstanceId={activeInstanceId}
          onActivate={onOpenApp}
        />
      </div>
    )
  }

  renderLoadedAppGroup(appGroups) {
    const { appsStatus, activeInstanceId, onRequestAppsReload } = this.props

    // Used by the menu transition
    const expandedInstancesCount = appGroups.reduce(
      (height, { instances }) =>
        instances.length > 1 &&
        instances.findIndex(
          ({ instanceId }) => instanceId === activeInstanceId
        ) > -1
          ? height + instances.length
          : height,
      0
    )

    // Wrap the DAO apps in the loader
    return (
      <MenuPanelAppsLoader
        key="menu-apps"
        appsStatus={appsStatus}
        onRetry={onRequestAppsReload}
        appsCount={appGroups.length}
        expandedInstancesCount={expandedInstancesCount}
      >
        {() => appGroups.map(app => this.renderAppGroup(app))}
      </MenuPanelAppsLoader>
    )
  }
}

class AnimatedMenuPanel extends React.Component {
  state = {
    animate: false,
  }
  _animateTimer = -1
  componentDidMount() {
    this.setState({ animate: this.props.autoClosing })
  }
  componentDidUpdate(prevProps) {
    this.updateAnimate(prevProps)
  }
  componentWillUnmount() {
    clearTimeout(this._animateTimer)
  }
  updateAnimate(prevProps) {
    if (prevProps.autoClosing === this.props.autoClosing) {
      return
    }

    // If we autoclosing has changed, it means we are switching from
    // autoclosing to fixed or the opposite, and we should stop animating the
    // panel for a short period of time.
    this.setState({ animate: false })
    this._animateTimer = setTimeout(() => {
      this.setState({ animate: true })
    }, 0)
  }

  render() {
    const { animate } = this.state
    const { openProgress, onCloseMenuPanel, ...props } = this.props
    return (
      <React.Fragment>
        <Spring
          from={{ progress: 0 }}
          to={{ progress: openProgress }}
          config={springs.lazy}
          immediate={!animate}
          native
        >
          {({ progress }) => (
            <Wrap
              style={{
                pointerEvents: openProgress === 1 ? 'auto' : 'none',
                transform: progress.interpolate(
                  v =>
                    `
                      translate3d(
                        calc(
                          ${-100 * (1 - v)}% -
                          ${SHADOW_WIDTH * (1 - v)}px
                        ),
                        0, 0
                      )
                    `
                ),
                opacity: progress.interpolate(v => (v > 0 ? 1 : 0)),
              }}
            >
              <MenuPanel {...props} />
            </Wrap>
          )}
        </Spring>
        <Viewport>
          {({ below }) =>
            below('medium') && (
              <Overlay opened={!!openProgress} onClick={onCloseMenuPanel} />
            )
          }
        </Viewport>
      </React.Fragment>
    )
  }
}

AnimatedMenuPanel.propTypes = {
  autoClosing: PropTypes.bool,
  openProgress: PropTypes.number.isRequired,
  onCloseMenuPanel: PropTypes.func.isRequired,
}

const StyledPreferencesButton = styled(Button)`
  display: inline-flex;
  margin: 0 auto 10px;
  align-items: center;
`

const Overlay = styled.div`
  position: absolute;
  z-index: 2;
  /* by leaving a 1px edge Android users can swipe to open
   * from the edge of their screen when an iframe app is being
   * used */
  width: ${({ opened }) => (opened ? '100vw' : '1px')};
  height: 100vh;
`

const Wrap = styled(animated.div)`
  position: absolute;
  z-index: 3;
  width: 90vw;
  height: 100vh;
  min-width: 300px;
  flex: none;

  ${breakpoint(
    'medium',
    `
      position: relative;
      width: 220px;
      min-width: 0;
    `
  )};
`

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: none;
  flex-direction: column;
  ${unselectable};
`

const In = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 1;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  box-shadow: 1px 0 ${SHADOW_WIDTH}px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;

  .actions {
    display: flex;
  }
  .actions a {
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: ${theme.textSecondary};
    cursor: pointer;
    outline: 0;
  }
  .actions a:hover {
    color: ${theme.textPrimary};
  }
`

const Content = styled.nav`
  overflow-y: auto;
  flex: 1 1 0;
  .in {
    padding: 10px 0 10px;
  }
  h1 {
    margin: 10px 30px;
    color: ${theme.textSecondary};
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 600;
  }
  ul {
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
  }
`

const ConnectionWrapper = styled.div`
  margin: 15px 20px;
`

const ConnectionBullet = styled.span`
  width: 8px;
  height: 8px;
  margin-top: -2px;
  margin-right: 8px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ connected }) =>
    connected ? theme.positive : theme.negative};
`

export default AnimatedMenuPanel
