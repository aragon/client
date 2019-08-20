import React from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring'
import {
  ButtonBase,
  IconDown,
  GU,
  springs,
  textStyle,
  unselectable,
  useTheme,
} from '@aragon/ui'
import memoize from 'lodash.memoize'
import { AppInstanceGroupType, AppsStatusType } from '../../prop-types'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup, { MENU_ITEM_BASE_HEIGHT } from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import AppIcon from '../AppIcon/AppIcon'

export const MENU_PANEL_SHADOW_WIDTH = 3
export const MENU_PANEL_WIDTH = 28 * GU

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_ORGANIZATION = staticApps.get('organization').app
const APP_PERMISSIONS = staticApps.get('permissions').app

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
    activeInstanceId: PropTypes.string,
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    onOpenApp: PropTypes.func.isRequired,
  }

  _systemAppsToggled = false

  state = {
    notifications: [],
    systemAppsOpened: systemAppsOpenedState.isOpen(),
    systemAppsToggled: false,
  }

  getRenderableAppGroups = memoize(appGroups =>
    appGroups
      .filter(appGroup => appGroup.hasWebApp)
      .map(appGroup => ({
        ...appGroup,
        icon: <AppIcon app={appGroup.app} />,
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
    const { appInstanceGroups } = this.props
    const { systemAppsOpened, systemAppsToggled } = this.state

    const appGroups = this.getRenderableAppGroups(appInstanceGroups)
    const menuApps = [APP_HOME, appGroups]
    const systemApps = [APP_PERMISSIONS, APP_APPS_CENTER, APP_ORGANIZATION]

    return (
      <Main>
        <div
          css={`
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            height: 100%;
            flex-shrink: 1;
            box-shadow: 2px 0 ${MENU_PANEL_SHADOW_WIDTH}px rgba(0, 0, 0, 0.05);
          `}
        >
          <nav
            css={`
              overflow-y: auto;
              flex: 1 1 0;
              padding-top: ${4 * GU}px;
            `}
          >
            <Heading>Apps</Heading>
            <div
              css={`
                margin-top: ${1 * GU}px;
              `}
            >
              {menuApps.map(app =>
                // If it's an array, it's the group being loaded from the ACL
                Array.isArray(app)
                  ? this.renderLoadedAppGroup(app)
                  : this.renderAppGroup(app)
              )}
            </div>
            <Spring
              config={springs.smooth}
              from={{ openProgress: 0 }}
              to={{ openProgress: Number(systemAppsOpened) }}
              immediate={!systemAppsToggled}
              native
            >
              {({ openProgress }) => (
                <div
                  css={`
                    margin-top: ${1 * GU}px;
                  `}
                >
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
                    <Heading
                      css={`
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                      `}
                    >
                      System
                      <SystemAppsToggleArrow
                        style={{
                          marginLeft: `${1 * GU}px`,
                          transform: openProgress.interpolate(
                            v => `rotate(${(1 - v) * 180}deg)`
                          ),
                          transformOrigin: '50% calc(50% - 0.5px)',
                        }}
                      />
                    </Heading>
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
                          v =>
                            v * systemApps.length * MENU_ITEM_BASE_HEIGHT + 'px'
                        ),
                      }}
                    >
                      {systemApps.map(app => this.renderAppGroup(app))}
                    </animated.div>
                  </div>
                </div>
              )}
            </Spring>
          </nav>
        </div>
      </Main>
    )
  }

  renderAppGroup(app) {
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
    const { appsStatus, activeInstanceId } = this.props

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
        appsCount={appGroups.length}
        expandedInstancesCount={expandedInstancesCount}
      >
        {() => appGroups.map(app => this.renderAppGroup(app))}
      </MenuPanelAppsLoader>
    )
  }
}

function Main(props) {
  const theme = useTheme()
  return (
    <div
      css={`
        background: ${theme.surface};
        width: 100%;
        height: 100%;
        display: flex;
        flex: none;
        flex-direction: column;
        ${unselectable};
      `}
      {...props}
    />
  )
}

function Heading(props) {
  const theme = useTheme()
  return (
    <h1
      css={`
        margin-left: ${3 * GU}px;
        ${textStyle('label2')}
        font-weight: 400;
        color: ${theme.surfaceContentSecondary};
      `}
      {...props}
    />
  )
}

function SystemAppsToggle(props) {
  const theme = useTheme()
  return (
    <ButtonBase
      css={`
        position: relative;
        width: 100%;
        padding: ${1 * GU}px 0;
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
      {...props}
    />
  )
}

const SystemAppsToggleArrow = props => (
  <animated.div {...props}>
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <IconDown size="tiny" />
    </div>
  </animated.div>
)

const SystemAppsToggleShadow = props => (
  <div
    css={`
      position: absolute;
      left: ${3 * GU}px;
      right: ${3 * GU}px;
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

export default MenuPanel
