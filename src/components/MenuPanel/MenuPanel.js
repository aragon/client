import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Text, breakpoint, springs, theme, unselectable } from '@aragon/ui'
import memoize from 'lodash.memoize'
import { appIconUrl } from '../../utils'
import { DaoAddressType } from '../../prop-types'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import RemoteIcon from '../RemoteIcon'
import NotificationAlert from '../Notifications/NotificationAlert'
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
    notifications: [],
  }

  getAppGroups = memoize(apps => prepareAppGroups(apps))

  render() {
    const {
      apps,
      connected,
      daoAddress,
      onNotificationClicked,
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
  opened,
  autoClosing,
  onCloseMenuPanel,
  ...props
}) => {
  return (
    <React.Fragment>
      <Spring
        from={{ progress: 0 }}
        to={{ progress: Number(opened) }}
        config={springs.lazy}
        immediate={!autoClosing}
        native
      >
        {({ progress }) => (
          <Wrap
            style={{
              transform: progress.interpolate(
                v =>
                  `translate3d(
                    calc((${-100 * (1 - v)}%) - (${SHADOW_WIDTH *
                    (1 - v)}px)), 0, 0)`
              ),
              opacity: progress.interpolate(v => (v > 0 ? 1 : 0)),
            }}
          >
            <MenuPanel {...props} />
          </Wrap>
        )}
      </Spring>
      <Overlay opened={opened} onClick={onCloseMenuPanel} />
    </React.Fragment>
  )
}

const Overlay = styled.div`
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  min-width: 320px;
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
  min-width: 300px;

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
