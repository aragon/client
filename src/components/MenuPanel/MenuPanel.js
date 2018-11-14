import React from 'react'
import PropTypes from 'prop-types'
// import { spring, Motion } from 'react-motion'
import styled from 'styled-components'
import {
  theme,
  unselectable,
  // spring as springConf,
  // IconWallet,
  // IconNotifications,
} from '@aragon/ui'
// import ClickOutHandler from 'react-onclickout'
// import NotificationsPanel from '../NotificationsPanel/NotificationsPanel'
// import { lerp } from '../../math-utils'
import { appIconUrl } from '../../utils'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import RemoteIcon from '../RemoteIcon'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from '../../symbols'

import logo from './assets/logo.svg'

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

class MenuPanel extends React.PureComponent {
  static propTypes = {
    apps: PropTypes.array.isRequired,
    appsStatus: PropTypes.oneOf([
      APPS_STATUS_ERROR,
      APPS_STATUS_READY,
      APPS_STATUS_LOADING,
    ]).isRequired,
    activeInstanceId: PropTypes.string,
    // notificationsObservable: PropTypes.object,
    onOpenApp: PropTypes.func.isRequired,
    // onClearAllNotifications: PropTypes.func.isRequired,
    // onOpenNotification: PropTypes.func.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
  }

  state = {
    notificationsOpened: false,
  }
  handleNotificationsClick = event => {
    // Prevent clickout events  to trigger
    event.nativeEvent.stopImmediatePropagation()
    this.setState(({ notificationsOpened }) => ({
      notificationsOpened: !notificationsOpened,
    }))
  }
  handleCloseNotifications = () => {
    this.setState({ notificationsOpened: false })
  }
  render() {
    const {
      apps,
      // notificationsObservable,
      // onClearAllNotifications,
      // onOpenNotification,
    } = this.props
    // const { notificationsOpened } = this.state

    const appGroups = prepareAppGroups(apps)
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
            <img src={logo} alt="Aragon" height="36" />
            {/*
            <div className="actions">
              <IconButton role="button" onClick={this.handleNotificationsClick}>
                <IconNotifications />
              </IconButton>
            </div>
            */}
          </Header>
          <Content>
            <div className="in">
              <h1>Apps</h1>
              <div>
                {menuApps.map(
                  app =>
                    // If it's an array, it's the group being loaded from the ACL
                    Array.isArray(app)
                      ? this.renderLoadedAppGroup(app)
                      : this.renderAppGroup(app, false)
                )}
              </div>
            </div>
          </Content>
        </In>

        {/* <ClickOutHandler onClickOut={this.handleCloseNotifications}>
          <Motion
            style={{
              openProgress: spring(
                Number(notificationsOpened),
                springConf('fast')
              ),
            }}
          >
            {({ openProgress }) => (
              <NotificationsWrapper
                style={{
                  transform: `
                    translate3d(${lerp(openProgress, -100, 0)}%, 0, 0)
                  `,
                  boxShadow: `1px 0 15px rgba(0, 0, 0, ${openProgress * 0.1})`,
                }}
              >
                <NotificationsPanel
                  observable={notificationsObservable}
                  onClearAllNotifications={onClearAllNotifications}
                  onOpenNotification={onOpenNotification}
                />
              </NotificationsWrapper>
            )}
          </Motion>
        </ClickOutHandler> */}
      </Main>
    )
  }
  renderAppGroup = (app, readyToExpand) => {
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
          expand={isActive && readyToExpand}
          activeInstanceId={activeInstanceId}
          onActivate={onOpenApp}
        />
      </div>
    )
  }
  renderLoadedAppGroup = apps => {
    const { appsStatus, onRequestAppsReload } = this.props

    // Wrap the DAO apps in the loader
    return (
      <MenuPanelAppsLoader
        key="menu-apps"
        appsStatus={appsStatus}
        itemsCount={apps.length}
        onRetry={onRequestAppsReload}
      >
        {done => apps.map(app => this.renderAppGroup(app, done))}
      </MenuPanelAppsLoader>
    )
  }
}

const Main = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 220px;
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

// const IconButton = styled.span`
//   cursor: pointer;
// `

// const NotificationsWrapper = styled.div`
//   position: fixed;
//   z-index: 1;
//   top: 0;
//   bottom: 0;
//   left: 220px;
// `

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

export default MenuPanel
