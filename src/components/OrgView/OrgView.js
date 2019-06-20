import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import {
  ButtonBase,
  // ButtonIcon,
  useTheme,
  useThemeMode,
  useViewport,
} from '@aragon/ui'
import { GU } from '../../utils'
import { DAO_STATUS_LOADING } from '../../symbols'
// import {
//   AppType,
//   AppsStatusType,
//   DaoAddressType,
//   DaoStatusType,
//   EthereumAddressType,
//   AppInstanceGroupType,
// } from '../../prop-types'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import CombinedPanel from '../MenuPanel/CombinedPanel'

function ThemeModeButton() {
  const { mode, toggle } = useThemeMode()
  return (
    <ButtonBase onClick={toggle} css="padding: 10px">
      {mode === 'dark' ? '🌝' : '🌚'}
    </ButtonBase>
  )
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
  onMenuPanelClose,
  onMenuPanelOpen,
  onOpenApp,
  onOpenPreferences,
  onRequestAppsReload,
  onRequestEnable,
}) {
  const theme = useTheme()
  const { below } = useViewport()

  const autoClosingPanel = below('medium')
  const [menuPanelOpened, setMenuPanelOpened] = useState(!autoClosingPanel)

  useEffect(() => {
    if (!autoClosingPanel) {
      setMenuPanelOpened(false)
    }
  }, [autoClosingPanel])

  return (
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
            onMenuPanelClose={onMenuPanelClose}
            onMenuPanelOpen={onMenuPanelOpen}
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
  )
}

// OrgView.propTypes = {
//   account: EthereumAddressType,
//   activeInstanceId: PropTypes.string,
//   appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
//   apps: PropTypes.arrayOf(AppType).isRequired,
//   appsStatus: AppsStatusType.isRequired,
//   children: PropTypes.node,
//   daoAddress: DaoAddressType.isRequired,
//   daoStatus: DaoStatusType.isRequired,
//   // onMenuPanelClose: PropTypes.func.isRequired,
//   // onMenuPanelOpen: PropTypes.func.isRequired,
//   onOpenApp: PropTypes.func.isRequired,
//   onOpenPreferences: PropTypes.func.isRequired,
//   onRequestAppsReload: PropTypes.func.isRequired,
//   onRequestEnable: PropTypes.func.isRequired,
// }

export default OrgView
