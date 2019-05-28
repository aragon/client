import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import throttle from 'lodash.throttle'
import color from 'onecolor'
import { ButtonBase, springs, theme, unselectable } from '@aragon/ui'
import memoize from 'lodash.memoize'
import {
  AppInstanceGroupType,
  AppsStatusType,
  DaoAddressType,
  DaoStatusType,
  EthereumAddressType,
} from '../../prop-types'
import { DAO_STATUS_LOADING } from '../../symbols'
import { staticApps } from '../../static-apps'
import MenuPanelFooter from './MenuPanelFooter'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import ActivityAlert from '../Activity/ActivityAlert'
import OrganizationSwitcher from './OrganizationSwitcher/OrganizationSwitcher'
import AppIcon from '../AppIcon/AppIcon'
import IconArrow from '../../icons/IconArrow'

export const MENU_PANEL_SHADOW_WIDTH = 15
export const MENU_PANEL_WIDTH = 220
export const MENU_ITEM_HEIGHT = 40

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_PERMISSIONS = staticApps.get('permissions').app
const APP_SETTINGS = staticApps.get('settings').app

const systemAppsOpenedState = {
  key: 'SYSTEM_APPS_OPENED_STATE',
  isOpen: function() {
    return localStorage.getItem(this.key) === '1'
  },
  set: function(opened) {
    localStorage.setItem(this.key, opened ? '1' : '0')
  },
}

// Interpolate the elevation of a toggle from which a drawer slides down.
// In / out example: [0, 0.25, 0.5, 0.75, 1] => [0, 0.5, 1, 0.5, 0]
const interpolateToggleElevation = (value, fn = v => v) =>
  value.interpolate(v => fn(1 - Math.abs(v * 2 - 1)))

class MenuPanel extends React.PureComponent {
  static propTypes = {
    account: EthereumAddressType,
    activeInstanceId: PropTypes.string,
    activityToggleRef: PropTypes.any,
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    connected: PropTypes.bool.isRequired,
    daoAddress: DaoAddressType.isRequired,
    daoStatus: DaoStatusType.isRequired,
    onActivityButtonClick: PropTypes.func.isRequired,
    onOpenApp: PropTypes.func.isRequired,
    onOpenPreferences: PropTypes.func.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
    onRequestEnable: PropTypes.func.isRequired,
    unreadActivityCount: PropTypes.number,
    viewportHeight: PropTypes.number,
  }

  _contentRef = React.createRef()
  _innerContentRef = React.createRef()
  _activityToggle = React.createRef()
  _systemAppsToggled = false

  state = {
    animate: false,
    notifications: [],
    scrollVisible: false,
    systemAppsOpened: systemAppsOpenedState.isOpen(),
    systemAppsToggled: false,
  }

  componentDidMount() {
    this.updateScrollVisible()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.viewportHeight !== this.props.viewportHeight) {
      this.tryUpdateScrollVisible()
    }
  }

  // A throttled version of updateScrollVisible with additional checks
  // to reduce performance overhead.
  tryUpdateScrollVisible = throttle(() => {
    if (
      this.props.appInstanceGroups.length > 0 ||
      this.state.systemAppsToggled
    ) {
      this.updateScrollVisible()
    }
  }, 100)

  // ResizeObserver is still not supported everywhere, so… this method checks
  // if the height of the content is higher than the height of the container,
  // which means that there is a scrollbar displayed.
  // It is called in two cases: when the viewport’s height changes, and when
  // the system menu open / close transition is running.
  updateScrollVisible = () => {
    const content = this._contentRef.current
    const innerContent = this._innerContentRef.current
    this.setState({
      scrollVisible:
        content &&
        innerContent &&
        innerContent.clientHeight > content.clientHeight,
    })
  }

  getRenderableAppGroups = memoize(appGroups =>
    appGroups
      .filter(appGroup => appGroup.hasWebApp)
      .map(appGroup => ({
        ...appGroup,
        icon: <AppIcon app={appGroup.app} size={22} />,
      }))
  )

  handleToggleSystemApps = () => {
    this.setState(
      ({ systemAppsOpened }) => ({
        systemAppsOpened: !systemAppsOpened,
        systemAppsToggled: true,
      }),
      () => systemAppsOpenedState.set(this.state.systemAppsOpened)
    )
  }

  render() {
    const {
      activityToggleRef,
      account,
      appInstanceGroups,
      connected,
      daoAddress,
      daoStatus,
      onActivityButtonClick,
      onOpenPreferences,
      unreadActivityCount,
      onRequestEnable,
    } = this.props
    const { scrollVisible, systemAppsOpened, systemAppsToggled } = this.state

    const appGroups = this.getRenderableAppGroups(appInstanceGroups)
    const menuApps = [APP_HOME, appGroups]
    const systemApps = [APP_PERMISSIONS, APP_APPS_CENTER, APP_SETTINGS]

    return (
      <Main>
        <In>
          <Header>
            <HeaderSlot css="width: 170px">
              <OrganizationSwitcher
                loading={daoStatus === DAO_STATUS_LOADING}
                currentDao={{
                  name: daoAddress.domain,
                  address: daoAddress.address,
                }}
              />
            </HeaderSlot>
            <HeaderSlot css="width: 50px" ref={activityToggleRef}>
              <ActivityAlert
                onClick={onActivityButtonClick}
                unreadActivityCount={unreadActivityCount}
              />
            </HeaderSlot>
          </Header>
          <Content ref={this._contentRef}>
            <div className="in" ref={this._innerContentRef}>
              <h1>Apps</h1>

              <div>
                {menuApps.map(app =>
                  // If it's an array, it's the group being loaded from the ACL
                  Array.isArray(app)
                    ? this.renderLoadedAppGroup(app)
                    : this.renderAppGroup(app, false)
                )}
              </div>
              <Spring
                config={springs.smooth}
                from={{ openProgress: 0 }}
                to={{ openProgress: Number(systemAppsOpened) }}
                immediate={!systemAppsToggled}
                onFrame={this.tryUpdateScrollVisible}
                native
              >
                {({ openProgress }) => (
                  <div>
                    <SystemAppsToggle onClick={this.handleToggleSystemApps}>
                      <SystemAppsToggleShadow
                        style={{
                          transform: interpolateToggleElevation(
                            openProgress,
                            v => `scale3d(${v}, 1, 1)`
                          ),
                          opacity: interpolateToggleElevation(openProgress),
                        }}
                      />
                      <h1
                        css={`
                          display: flex;
                          justify-content: flex-start;
                          align-items: flex-end;
                        `}
                      >
                        <span>System</span>
                        <SystemAppsToggleArrow
                          style={{
                            marginLeft: '5px',
                            transform: openProgress.interpolate(
                              v => `rotate(${(1 - v) * 180}deg)`
                            ),
                            transformOrigin: '50% calc(50% - 0.5px)',
                          }}
                        />
                      </h1>
                    </SystemAppsToggle>
                    <div css="overflow: hidden">
                      <animated.div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          width: '100%',
                          opacity: openProgress,
                          height: openProgress.interpolate(
                            v => v * systemApps.length * MENU_ITEM_HEIGHT + 'px'
                          ),
                        }}
                      >
                        {systemApps.map(app => this.renderAppGroup(app, true))}
                      </animated.div>
                    </div>
                  </div>
                )}
              </Spring>
            </div>
          </Content>
          {scrollVisible && (
            <div
              css={`
                width: 100%;
                height: 0;
                border-bottom: 1px solid ${theme.contentBorder};
              `}
            />
          )}
          <MenuPanelFooter
            account={account}
            onRequestEnable={onRequestEnable}
            connected={connected}
            onOpenPreferences={onOpenPreferences}
          />
        </In>
      </Main>
    )
  }

  renderAppGroup(app, isSystem) {
    const { activeInstanceId, onOpenApp } = this.props

    const { appId, name, icon, instances } = app
    const isActive =
      instances.findIndex(
        ({ instanceId }) => instanceId === activeInstanceId
      ) !== -1

    return (
      <div key={appId}>
        <MenuPanelAppGroup
          name={name}
          icon={icon}
          system={isSystem}
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

const SystemAppsToggle = styled(ButtonBase)`
  position: relative;
  width: 100%;
  padding: 0;
  margin: 20px 0 0;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  outline: none;
  &:active {
    background: ${color(theme.secondaryBackground)
      .alpha(0.3)
      .cssa()};
  }
`

const SystemAppsToggleArrow = props => (
  <animated.div {...props}>
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
      `}
    >
      <IconArrow />
    </div>
  </animated.div>
)

const SystemAppsToggleShadow = props => (
  <div
    css={`
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 0;
    `}
  >
    <animated.div {...props}>
      <div
        css={`
          height: 1px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        `}
      />
    </animated.div>
  </div>
)

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
  border-right: 1px solid ${theme.contentBorder};
  box-shadow: 1px 0 ${MENU_PANEL_SHADOW_WIDTH}px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  height: 64px;
  border-bottom: 1px solid ${theme.contentBorder};
`

const HeaderSlot = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
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
