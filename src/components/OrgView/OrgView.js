import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  IconMenu,
  GU,
  useTheme,
  useViewport,
  springs,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import {
  AppInstanceGroupType,
  AppsStatusType,
  AppType,
  DaoAddressType,
  DaoStatusType,
} from '../../prop-types'
import { DAO_STATUS_LOADING } from '../../symbols'
import { iOS, isSafari } from '../../utils'
import { useClientTheme } from '../../client-theme'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import MenuPanel, { MENU_PANEL_WIDTH } from '../MenuPanel/MenuPanel'
import AccountModule from '../AccountModule/AccountModule'
import ActivityButton from './ActivityButton/ActivityButton'
import GlobalPreferencesButton from './GlobalPreferencesButton/GlobalPreferencesButton'

// Remaining viewport width after the menu panel is factored in
const AppWidthContext = React.createContext(0)

const AnimatedDiv = animated.div

function OrgView({
  activeInstanceId,
  appInstanceGroups,
  apps,
  appsStatus,
  children,
  daoAddress,
  daoStatus,
  onOpenApp,
  onOpenPreferences,
}) {
  const theme = useTheme()
  const { appearance } = useClientTheme()
  const { width, below } = useViewport()

  const autoClosingPanel = below('medium')
  const [menuPanelOpen, setMenuPanelOpen] = useState(!autoClosingPanel)

  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen(opened => !opened),
    []
  )

  const handleCloseMenuPanel = useCallback(() => setMenuPanelOpen(false), [])

  const handleOpenApp = useCallback(
    (...args) => {
      if (autoClosingPanel) {
        handleCloseMenuPanel()
      }
      onOpenApp(args)
    },
    [autoClosingPanel, handleCloseMenuPanel, onOpenApp]
  )

  useEffect(() => {
    setMenuPanelOpen(!autoClosingPanel)
  }, [autoClosingPanel])

  const [showAppOverlay, setShowAppOverlay] = useState(false)

  useEffect(() => {
    setShowAppOverlay(true)

    const timer = setTimeout(() => {
      setShowAppOverlay(false)
    }, 0)

    return () => {
      clearTimeout(timer)
      setShowAppOverlay(false)
    }
  }, [appearance])

  return (
    <AppWidthContext.Provider
      value={autoClosingPanel ? width : width - MENU_PANEL_WIDTH}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100%;
          width: 100%;
          background: ${theme.background};
        `}
      >
        <div
          css={`
            flex-shrink: 0;
            position: relative;
            z-index: 2;
            height: ${8 * GU}px;
            display: flex;
            justify-content: space-between;
            background: ${theme.surface};
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);

            ${menuPanelOpen && iOS
              ? `
                /* behaviour only in iOS:
                 * with the nested div->div->div structure
                 * the 3rd div has positioned absolute
                 * Chrome, Firefox and Safari uch div gets rendered
                 * aboe the rest of the content (up the tree till a
                 * position relative is found) but in iOS it gets
                 * rendered below the sibling of the element with
                 * position relative (and z-index did not work)
                 * this fix gives the element an absolute (z-index
                 * layers are then respected);
                 * this also adds the appropriate value to recover the
                 * elements height
                 * */
                position: absolute;
                width: 100%;
                z-index: 0;
              `
              : ''}
          `}
        >
          {autoClosingPanel ? (
            <ButtonIcon
              label="Open menu"
              onClick={toggleMenuPanel}
              css={`
                position: relative;
                top: ${2 * GU}px;
                left: ${2 * GU}px;
              `}
            >
              <IconMenu />
            </ButtonIcon>
          ) : (
            <OrganizationSwitcher
              loading={daoStatus === DAO_STATUS_LOADING}
              currentDao={{
                name: daoAddress.domain,
                address: daoAddress.address,
              }}
            />
          )}
          <div css="display: flex">
            <AccountModule />
            <GlobalPreferencesButton onOpen={onOpenPreferences} />
            <ActivityButton apps={apps} />
          </div>
        </div>
        <div
          css={`
            flex-grow: 1;
            overflow-y: hidden;
            margin-top: 2px;
            ${menuPanelOpen && iOS
              ? `
                padding-top: ${8 * GU}px;
              `
              : ''}
          `}
        >
          <div
            css={`
              display: flex;
              height: 100%;
              ${iOS || isSafari
                ? `
                  height: calc(100vh - ${8 * GU}px);
                `
                : ''}
            `}
          >
            <MenuPanel
              activeInstanceId={activeInstanceId}
              appInstanceGroups={appInstanceGroups}
              appsStatus={appsStatus}
              autoClosing={autoClosingPanel}
              daoAddress={daoAddress}
              daoStatus={daoStatus}
              onMenuPanelClose={handleCloseMenuPanel}
              onOpenApp={handleOpenApp}
              opened={menuPanelOpen}
              css="z-index: 3"
            />
            <div
              css={`
                flex-grow: 1;
                display: flex;
                position: relative;
                z-index: 1;
              `}
            >
              <Transition
                config={springs.lazy}
                items={showAppOverlay}
                immediate={showAppOverlay}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}
              >
                {show =>
                  show &&
                  (({ opacity }) => (
                    <AnimatedDiv
                      style={{ opacity }}
                      css={`
                        position: absolute;
                        z-index: 2;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: ${theme.background};
                      `}
                    />
                  ))
                }
              </Transition>
              <div
                css={`
                  position: relative;
                  z-index: 1;
                  flex-grow: 1;
                  overflow: hidden;
                `}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppWidthContext.Provider>
  )
}
OrgView.propTypes = {
  activeInstanceId: PropTypes.string,
  apps: PropTypes.arrayOf(AppType).isRequired,
  appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
  appsStatus: AppsStatusType.isRequired,
  children: PropTypes.node,
  daoAddress: DaoAddressType.isRequired,
  daoStatus: DaoStatusType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onOpenPreferences: PropTypes.func.isRequired,
}

export { AppWidthContext }
export default OrgView
