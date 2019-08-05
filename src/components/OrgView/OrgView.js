import React, { useContext, useEffect, useState } from 'react'
import { ButtonBase, useTheme, useThemeMode, useViewport } from '@aragon/ui'
import { GU } from '../../utils'
import { DAO_STATUS_LOADING } from '../../symbols'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import CombinedPanel from '../MenuPanel/CombinedPanel'
import GlobalSettingsButton from './GlobalSettingsButton'
import { MENU_PANEL_WIDTH } from '../MenuPanel/MenuPanel'

function ThemeModeButton() {
  const { mode, toggle } = useThemeMode()
  return (
    <ButtonBase onClick={toggle} css="padding: 10px">
      {mode === 'dark' ? '🌝' : '🌚'}
    </ButtonBase>
  )
}

// Remaining width after the menu panel is removed
const AppWidthContext = React.createContext(0)

export function useAppWidth() {
  return useContext(AppWidthContext)
}

function OrgView({
  daoStatus,
  daoAddress,
  children,
  account,
  activeInstanceId,
  appInstanceGroups,
  apps,
  appsStatus,
  onOpenApp,
  onOpenPreferences,
  onRequestAppsReload,
  onRequestEnable,
}) {
  const theme = useTheme()
  const { width, below } = useViewport()

  const autoClosingPanel = below('medium')
  const [menuPanelOpened, setMenuPanelOpened] = useState(!autoClosingPanel)

  useEffect(() => {
    if (!autoClosingPanel) {
      setMenuPanelOpened(false)
    }
  }, [autoClosingPanel])

  return (
    <AppWidthContext.Provider value={width - MENU_PANEL_WIDTH}>
      <div
        css={`
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: ${theme.background};
        `}
      >
        <div
          css={`
            flex-shrink: 0;
            position: relative;
            z-index: 1;
            height: ${8 * GU}px;
            display: flex;
            justify-content: space-between;
            background: ${theme.surface};
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          `}
        >
          <OrganizationSwitcher
            loading={daoStatus === DAO_STATUS_LOADING}
            currentDao={{
              name: daoAddress.domain,
              address: daoAddress.address,
            }}
          />
          <div
            css={`
              display: flex;
            `}
          >
            <GlobalSettingsButton onOpen={onOpenPreferences} />
            <ThemeModeButton />
          </div>
        </div>
        <div
          css={`
            flex-grow: 1;
            overflow-y: hidden;
            margin-top: 1px;
          `}
        >
          <div
            css={`
              position: relative;
              z-index: 2;
              height: 100%;
              display: flex;
            `}
          >
            <CombinedPanel
              activeInstanceId={activeInstanceId}
              appInstanceGroups={appInstanceGroups}
              apps={apps}
              appsStatus={appsStatus}
              daoAddress={daoAddress}
              daoStatus={daoStatus}
              onOpenApp={onOpenApp}
              onOpenPreferences={onOpenPreferences}
              onRequestAppsReload={onRequestAppsReload}
              opened={menuPanelOpened}
            >
              <div
                css={`
                  position: relative;
                  z-index: 1;
                  flex-grow: 1;
                  overflow: auto;
                `}
              >
                {children}
              </div>
            </CombinedPanel>
          </div>
        </div>
      </div>
    </AppWidthContext.Provider>
  )
}

export default OrgView
