import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, GU, useTheme, useThemeMode, useViewport } from '@aragon/ui'
import {
  AppInstanceGroupType,
  AppsStatusType,
  AppType,
  DaoAddressType,
  DaoStatusType,
} from '../../prop-types'
import { DAO_STATUS_LOADING } from '../../symbols'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import CombinedPanel from '../MenuPanel/CombinedPanel'
import { MENU_PANEL_WIDTH } from '../MenuPanel/MenuPanel'
import GlobalPreferencesButton from './GlobalPreferencesButton/GlobalPreferencesButton'

function ThemeModeButton() {
  const { mode, toggle } = useThemeMode()
  return (
    <ButtonBase onClick={toggle} css="padding: 10px">
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
  const [menuPanelOpened, setMenuPanelOpened] = useState(!autoClosingPanel)

  useEffect(() => {
    if (!autoClosingPanel) {
      setMenuPanelOpened(false)
    }
  }, [autoClosingPanel])

  // TODO: update AppWidthContext's value when menu panel is closed
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
            <GlobalPreferencesButton onOpen={onOpenPreferences} />
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
