import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  ButtonIcon,
  IconMenu,
  GU,
  useTheme,
  useThemeMode,
  useViewport,
} from '@aragon/ui'
import {
  AppInstanceGroupType,
  AppsStatusType,
  AppType,
  DaoAddressType,
  DaoStatusType,
} from '../../prop-types'
import { DAO_STATUS_LOADING } from '../../symbols'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import MenuPanel, { MENU_PANEL_WIDTH } from '../MenuPanel/MenuPanel'
import ActivityButton from './ActivityButton/ActivityButton'
import GlobalPreferencesButton from './GlobalPreferencesButton/GlobalPreferencesButton'

function ThemeModeButton() {
  const { mode, toggle } = useThemeMode()
  return (
    <ButtonBase
      onClick={toggle}
      css={`
        padding: ${1 * GU}px;
      `}
    >
      {mode === 'dark' ? '🌝' : '🌚'}
    </ButtonBase>
  )
}

// Remaining viewport width after the menu panel is factored in
const AppWidthContext = React.createContext(0)

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
            <ThemeModeButton />
            <GlobalPreferencesButton onOpen={onOpenPreferences} />
            <ActivityButton apps={apps} />
          </div>
        </div>
        <div
          css={`
            flex-grow: 1;
            overflow-y: hidden;
            margin-top: 2px;
          `}
        >
          <div
            css={`
              height: 100%;
              display: flex;
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
              css={`
                z-index: 3;
              `}
            />
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
