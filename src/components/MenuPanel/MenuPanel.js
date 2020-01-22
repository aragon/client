import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { lerp } from '../../math-utils'
import {
  AppInstanceGroupType,
  AppsStatusType,
  DaoAddressType,
  DaoStatusType,
} from '../../prop-types'
import { useConsole } from '../../apps/Console/useConsole'
import { staticApps } from '../../static-apps'
import { DAO_STATUS_LOADING } from '../../symbols'
import MenuPanelAppGroup, { MENU_ITEM_BASE_HEIGHT } from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import OrganizationSwitcher from './OrganizationSwitcher/OrganizationSwitcher'
import AppIcon from '../AppIcon/AppIcon'

export const MENU_PANEL_SHADOW_WIDTH = 3
export const MENU_PANEL_WIDTH = 28 * GU

const { div: AnimDiv } = animated

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_CONSOLE = staticApps.get('console').app
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

function MenuPanel({
  activeInstanceId,
  appInstanceGroups,
  appsStatus,
  daoAddress,
  daoStatus,
  onOpenApp,
  showOrgSwitcher,
}) {
  const { consoleVisible } = useConsole()

  const [systemAppsOpened, setSystemAppsOpened] = useState(
    systemAppsOpenedState.isOpen()
  )
  const [showSystemsAppsAnimation, setShowSystemsAppsAnimation] = useState(
    false
  )

  const appGroups = useMemo(
    () =>
      appInstanceGroups
        .filter(appGroup => appGroup.hasWebApp)
        .map(appGroup => ({
          ...appGroup,
          icon: <AppIcon app={appGroup.app} />,
        })),
    [appInstanceGroups]
  )

  const showConsole = consoleVisible || activeInstanceId === 'console'
  const menuApps = [APP_HOME, appGroups]
  const systemApps = [
    APP_PERMISSIONS,
    APP_APPS_CENTER,
    APP_ORGANIZATION,
    ...(showConsole ? [APP_CONSOLE] : []),
  ]

  const isSystemAppActive = useMemo(
    () => systemApps.some(systemApp => systemApp.appId === activeInstanceId),
    [activeInstanceId, systemApps]
  )

  const handleToggleSystemApps = useCallback(() => {
    setSystemAppsOpened(opened => {
      const openedState = !opened
      systemAppsOpenedState.set(openedState)
      return openedState
    })
    setShowSystemsAppsAnimation(true)
  }, [])

  const renderAppGroup = useCallback(
    app => {
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
    },
    [activeInstanceId, onOpenApp]
  )

  const renderLoadedAppGroup = useCallback(
    appGroups => {
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
          expandedInstancesCount={expandedInstancesCount}
        >
          {appGroups.map(app => renderAppGroup(app))}
        </MenuPanelAppsLoader>
      )
    },
    [appsStatus, activeInstanceId, renderAppGroup]
  )

  useEffect(() => {
    // Automatically toggle the system apps menu if a system app is activated/deactivated
    // If the user has manually opened the system apps menu, keep it open
    setSystemAppsOpened(isSystemAppActive || systemAppsOpenedState.isOpen())
    setShowSystemsAppsAnimation(true)
  }, [isSystemAppActive])

  return (
    <Main>
      <div
        css={`
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          flex-shrink: 1;
          box-shadow: 2px 0 ${MENU_PANEL_SHADOW_WIDTH}px rgba(0, 0, 0, 0.05);
        `}
      >
        {showOrgSwitcher && (
          <OrganizationSwitcher
            loading={daoStatus === DAO_STATUS_LOADING}
            currentDao={{
              name: daoAddress.domain,
              address: daoAddress.address,
            }}
          />
        )}
        <nav
          css={`
            overflow-y: auto;
            flex: 1 1 0;
            padding-top: ${(showOrgSwitcher ? 1 : 3) * GU}px;
          `}
        >
          <Heading label="Apps" />
          <div
            css={`
              margin-top: ${0.5 * GU}px;
            `}
          >
            {menuApps.map(app =>
              // If it's an array, it's the group being loaded from the ACL
              Array.isArray(app)
                ? renderLoadedAppGroup(app)
                : renderAppGroup(app)
            )}
          </div>
          <Spring
            config={springs.smooth}
            from={{ openProgress: 0 }}
            to={{ openProgress: Number(systemAppsOpened) }}
            immediate={!showSystemsAppsAnimation}
            native
          >
            {({ openProgress }) => (
              <div
                css={`
                  margin-top: ${1 * GU}px;
                  padding-bottom: ${3 * GU}px;
                `}
              >
                <SystemAppsToggle onClick={handleToggleSystemApps}>
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
                    label="System"
                    css={`
                      height: ${5 * GU}px;
                    `}
                  >
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
                  <AnimDiv
                    css={`
                      display: flex;
                      flex-direction: column;
                      justify-content: flex-end;
                    `}
                    style={{
                      opacity: openProgress,
                      height: openProgress.interpolate(
                        v =>
                          v * systemApps.length * MENU_ITEM_BASE_HEIGHT + 'px'
                      ),
                    }}
                  >
                    {systemApps.map(app =>
                      app.appId !== 'console' ? (
                        renderAppGroup(app)
                      ) : (
                        <Spring
                          key={app.appId}
                          immediate={consoleVisible}
                          config={springs.swift}
                          from={{ opacity: 0 }}
                          to={{
                            opacity: Number(showConsole),
                          }}
                        >
                          {({ opacity }) => (
                            <AnimDiv style={{ opacity }}>
                              {renderAppGroup(app)}
                            </AnimDiv>
                          )}
                        </Spring>
                      )
                    )}
                  </AnimDiv>
                </div>
              </div>
            )}
          </Spring>
        </nav>
      </div>
    </Main>
  )
}
MenuPanel.propTypes = {
  activeInstanceId: PropTypes.string,
  appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
  appsStatus: AppsStatusType.isRequired,
  daoAddress: DaoAddressType.isRequired,
  daoStatus: DaoStatusType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  showOrgSwitcher: PropTypes.bool,
}

function AnimatedMenuPanel({
  autoClosing,
  className,
  onMenuPanelClose,
  opened,
  ...props
}) {
  const theme = useTheme()
  const [animate, setAnimate] = useState(autoClosing)

  useEffect(() => {
    // If autoClosing has changed, it means we are switching from autoClosing
    // to fixed or the opposite, and we should stop animating the panel for a
    // short period of time.
    setAnimate(false)
    const animateTimer = setTimeout(() => setAnimate(true), 0)
    return () => clearTimeout(animateTimer)
  }, [autoClosing])

  return (
    <Spring
      from={{ menuPanelProgress: 0 }}
      to={{ menuPanelProgress: Number(opened) }}
      config={springs.lazy}
      immediate={!animate}
      native
    >
      {({ menuPanelProgress }) => (
        <div
          className={className}
          css={`
            /* When the panel is autoclosing, we want it over the top bar as well */
            ${autoClosing
              ? `
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                ${!opened ? 'pointer-events: none' : ''}
              `
              : ''}
          `}
        >
          {autoClosing && (
            <AnimDiv
              onClick={onMenuPanelClose}
              css={`
                position: absolute;
                height: 100%;
                width: 100%;
                background: ${theme.overlay.alpha(0.9)};
                ${!opened ? 'pointer-events: none' : ''}
              `}
              style={{
                opacity: menuPanelProgress,
              }}
            />
          )}
          <AnimDiv
            css={`
              width: ${MENU_PANEL_WIDTH}px;
              height: 100%;
              flex: none;
            `}
            style={{
              position: autoClosing ? 'absolute' : 'relative',
              transform: menuPanelProgress.interpolate(
                v =>
                  `translate3d(
                    ${lerp(
                      v,
                      -(MENU_PANEL_WIDTH + MENU_PANEL_SHADOW_WIDTH),
                      0
                    )}px, 0, 0)`
              ),
            }}
          >
            <MenuPanel showOrgSwitcher={autoClosing} {...props} />
          </AnimDiv>
        </div>
      )}
    </Spring>
  )
}
AnimatedMenuPanel.propTypes = {
  autoClosing: PropTypes.bool,
  className: PropTypes.string,
  onMenuPanelClose: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  ...MenuPanel.propTypes,
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

function Heading({ label, children, ...props }) {
  const theme = useTheme()
  return (
    <h1
      css={`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: ${3 * GU}px;
        margin-left: ${3 * GU}px;
        color: ${theme.surfaceContentSecondary};
        ${textStyle('label2')}
        font-weight: 400;
      `}
      {...props}
    >
      <div
        css={`
          margin-top: 2px;
        `}
      >
        {label}
      </div>
      {children && <div>{children}</div>}
    </h1>
  )
}
Heading.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
}

function SystemAppsToggle(props) {
  const theme = useTheme()
  return (
    <ButtonBase
      css={`
        position: relative;
        width: 100%;
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

export default AnimatedMenuPanel
