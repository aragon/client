import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import {
  Text,
  theme,
  unselectable,
  breakpoint,
  BreakPoint,
  springs,
  IconNotifications,
} from '@aragon/ui'
import memoize from 'lodash.memoize'
import { appIconUrl } from '../../utils'
import { DaoAddressType } from '../../prop-types'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import RemoteIcon from '../RemoteIcon'
import OrganizationSwitcher from './OrganizationSwitcher/OrganizationSwitcher'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from '../../symbols'

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_PERMISSIONS = staticApps.get('permissions').app
const APP_SETTINGS = staticApps.get('settings').app

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

const Badge = styled(animated.div)`
  display: inline-flex;
  font-weight: 600;
  white-space: nowrap;
  color: ${theme.badgeNotificationForeground};
  background: ${theme.badgeNotificationBackground};
  overflow: hidden;
  padding-top: 2px;
  letter-spacing: -0.5px;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  line-height: 1.5;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`

class Alert extends React.PureComponent {
  render() {
    let { notifications, onNotificationClicked, notificationOpen } = this.props
    return (
      <div className="actions">
        <IconButton
          style={{ height: 22 }}
          role="button"
          tabindex={0}
          onClick={() => {
            onNotificationClicked()
          }}
        >
          <IconNotifications />
          <Spring
            native
            reset
            from={{ opacity: 0, size: 0 }}
            to={{ opacity: notifications ? 1 : 0, size: 1 }}
            config={springs.lazy}
          >
            {props => (
              <Badge
                style={{
                  ...props,
                  position: 'absolute',
                  marginLeft: -12,
                  marginTop: -8,
                  transform: props.size
                    .interpolate(
                      [0, 0.2, 0.4, 0.6, 0.8, 1],
                      [1.5, 1, 1.5, 1, 1.5, 1]
                    )
                    .interpolate(s => `scale(${s})`),
                }}
              >
                {notifications && notifications}
              </Badge>
            )}
          </Spring>
        </IconButton>
      </div>
    )
  }
}

class MenuPanel extends React.PureComponent {
  static propTypes = {
    apps: PropTypes.array.isRequired,
    appsStatus: PropTypes.oneOf([
      APPS_STATUS_ERROR,
      APPS_STATUS_READY,
      APPS_STATUS_LOADING,
    ]).isRequired,
    activeInstanceId: PropTypes.string,
    onOpenApp: PropTypes.func.isRequired,
    onNotificationClicked: PropTypes.func.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
    daoAddress: DaoAddressType.isRequired,
    connected: PropTypes.bool.isRequired,
    notifications: PropTypes.number,
  }

  state = {
    notificationsOpened: false,
    notifications: [],
  }

  handleCloseNotifications = () => {
    this.setState({ notificationsOpened: false })
  }

  getAppGroups = memoize(apps => prepareAppGroups(apps))

  render() {
    const {
      apps,
      connected,
      daoAddress,
      onNotificationClicked,
      notifications,
      notificationOpen,
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
            <Alert
              notificationOpen={notificationOpen}
              notifications={notifications}
              onNotificationClicked={onNotificationClicked}
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

const AnimatedMenuPanel = ({
  menuPanelOpened,
  onCloseMenuPanel,
  autohide,
  ...props
}) => {
  return (
    <React.Fragment>
      <Spring
        from={{ progress: 0 }}
        to={{ progress: !!menuPanelOpened }}
        config={springs.lazy}
        native
        immediate={!autohide}
      >
        {({ progress }) => (
          <Wrap
            style={{
              transform: progress.interpolate(
                v => `translate3d(${-100 * (1 - v)}%, 0, 0)`
              ),
              opacity: progress.interpolate(v => (v > 0 ? 1 : 0)),
            }}
          >
            <MenuPanel {...props} />
          </Wrap>
        )}
      </Spring>
      <Overlay opened={menuPanelOpened} onClick={onCloseMenuPanel} />
    </React.Fragment>
  )
}

const Overlay = styled.div`
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: ${({ opened }) => (opened ? 'block' : 'none')};

  ${breakpoint(
    'medium',
    `
      display: none;
    `
  )};
`

const Wrap = styled(animated.div)`
  position: absolute;
  z-index: 3;
  width: 90vw;
  height: 100vh;

  ${breakpoint(
    'medium',
    `
      position: relative;
      width: 220px;
    `
  )};
`

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
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
  box-shadow: 1px 0 15px rgba(0, 0, 0, 0.1);
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

export default props => (
  <React.Fragment>
    <BreakPoint from="medium">
      <AnimatedMenuPanel {...props} />
    </BreakPoint>
    <BreakPoint to="medium">
      <AnimatedMenuPanel {...props} autohide />
    </BreakPoint>
  </React.Fragment>
)
const IconButton = styled.span`
  cursor: pointer;
`
