import React from 'react'
import { spring, Motion } from 'react-motion'
import resolvePathname from 'resolve-pathname'
import styled from 'styled-components'
import {
  theme,
  unselectable,
  spring as springConf,
  IconHome,
  IconSettings,
  IconPermissions,
  IconApps,
  // IconWallet,
  // IconNotifications,
} from '@aragon/ui'
import ClickOutHandler from 'react-onclickout'
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel'
import { lerp } from '../../math-utils'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'

import logo from './assets/logo.svg'

const appHome = { appId: 'home', name: 'Home', icon: <IconHome /> }
const appSettings = {
  appId: 'settings',
  name: 'Settings',
  icon: <IconSettings />,
}
const appPermissions = {
  appId: 'permissions',
  name: 'Permissions',
  icon: <IconPermissions />,
}
const appApps = {
  appId: 'apps',
  name: 'Apps',
  icon: <IconApps />,
}

const addIcons = apps =>
  apps.map(app => ({
    ...app,
    icon: (
      <img src={`${resolvePathname('images/icon.svg', app.baseUrl)}`} alt="" />
    ),
  }))

class MenuPanel extends React.Component {
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
      notificationsObservable,
      onClearAllNotifications,
      onOpenNotification,
    } = this.props
    const { notificationsOpened } = this.state

    const daoApps = addIcons(apps)
    const menuApps = [appHome, daoApps, appPermissions, appApps, appSettings]

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
              <div>{menuApps.map(this.renderApp)}</div>
            </div>
          </Content>
        </In>

        <ClickOutHandler onClickOut={this.handleCloseNotifications}>
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
                  transform: `translateX(${lerp(openProgress, -100, 0)}%)`,
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
        </ClickOutHandler>
      </Main>
    )
  }
  renderApp = app => {
    const { activeAppId, activeInstanceId, onOpenApp, appsLoading } = this.props

    // Wrap the DAO apps in the loader
    if (Array.isArray(app)) {
      return (
        <MenuPanelAppsLoader key="menu-apps" loading={appsLoading}>
          {app.map(this.renderApp)}
        </MenuPanelAppsLoader>
      )
    }

    const { appId, name, icon, instances = [] } = app
    return (
      <div key={appId}>
        <MenuPanelAppGroup
          name={name}
          icon={icon}
          appId={appId}
          active={appId === activeAppId}
          instances={instances}
          activeInstanceId={activeInstanceId}
          onActivate={onOpenApp}
          comingSoon={['permissions', 'apps'].includes(appId)}
        />
      </div>
    )
  }
}

const Main = styled.div`
  flex-shrink: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  ${unselectable};
`

const In = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  box-shadow: 1px 0 15px rgba(0, 0, 0, 0.1);
`

// const IconButton = styled.span`
//   cursor: pointer;
// `

const NotificationsWrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 220px;
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
  height: 100%;
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
