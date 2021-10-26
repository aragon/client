import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  GU,
  IconMenu,
  springs,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import {
  AppType,
  AppsStatusType,
  AragonType,
  DaoAddressType,
  DaoStatusType,
  RepoType,
} from '../../prop-types'
import styled from 'styled-components'

import { DAO_STATUS_LOADING } from '../../symbols'
import { iOS, isSafari } from '../../util/utils'
import { useClientTheme } from '../../client-theme'
import { useRouting } from '../../routing'
import ActivityButton from './ActivityButton/ActivityButton'
import AccountModule from '../AccountModule/AccountModule'
import GlobalPreferencesButton from './GlobalPreferencesButton/GlobalPreferencesButton'
import MenuPanel, { MENU_PANEL_WIDTH } from '../MenuPanel/MenuPanel'
import OrgViewApp from './OrgViewApp'
import OrganizationSwitcher from '../MenuPanel/OrganizationSwitcher/OrganizationSwitcher'
import SignerPanel from '../SignerPanel/SignerPanel'
import UpgradeBanner from '../Upgrade/UpgradeBanner'
import UpgradeModal from '../Upgrade/UpgradeModal'
import UpgradeOrganizationPanel from '../Upgrade/UpgradeOrganizationPanel'
import { NetworkIndicator } from '../NetworkIndicator/NetworkIndicator'
import { NetworkSwitchModal } from '../Modals'
import { trackEvent, events } from '../../analytics'
import { useWallet } from '../../contexts/wallet'

// Remaining viewport width after the menu panel is factored in
const AppWidthContext = React.createContext(0)

const AnimatedDiv = animated.div

function OrgView({
  apps,
  appsStatus,
  canUpgradeOrg,
  daoAddress,
  daoStatus,
  historyBack,
  repos,
  permissionsLoading,
  signatureBag,
  transactionBag,
  visible,
  web3,
  wrapper,
}) {
  const { networkType } = useWallet()
  const theme = useTheme()
  const routing = useRouting()
  const { appearance } = useClientTheme()
  const { width, below } = useViewport()
  const autoClosingPanel = below('medium')

  const [menuPanelOpen, setMenuPanelOpen] = useState(!autoClosingPanel)
  const [orgUpgradePanelOpened, setOrgUpgradePanelOpened] = useState(false)
  const [networkModalOpened, setNetworkModalOpened] = useState(false)
  const [upgradeModalOpened, setUpgradeModalOpened] = useState(false)

  const appInstanceGroups = useMemo(
    () =>
      apps.reduce((groups, app) => {
        const group = groups.find(({ appId }) => appId === app.appId)

        const {
          // This is not technically fully true, but let's assume that only these
          // aspects are different between multiple instances of the same app
          codeAddress: instanceCodeAddress,
          identifier: instanceIdentifier,
          proxyAddress: instanceProxyAddress,
          ...sharedAppInfo
        } = app

        const instance = {
          codeAddress: instanceCodeAddress,
          identifier: instanceIdentifier,
          instanceId: instanceProxyAddress,
          proxyAddress: instanceProxyAddress,
        }

        // Append the instance to the existing app group
        if (group) {
          group.instances.push(instance)
          return groups
        }

        return groups.concat([
          {
            app: sharedAppInfo,
            appId: app.appId,
            name: app.name,
            instances: [instance],
            hasWebApp: app.hasWebApp,
            repoName: app.appName,
          },
        ])
      }, []),
    [apps]
  )

  const openApp = useCallback(
    (instanceId, { instancePath } = {}) => {
      routing.update(({ mode }) => ({
        mode: { ...mode, instanceId, instancePath },
      }))
    },
    [routing]
  )

  const handleCloseMenuPanel = useCallback(() => setMenuPanelOpen(false), [])

  const hideOrgUpgradePanel = useCallback(() => {
    setOrgUpgradePanelOpened(false)
  }, [])

  const handleOpenApp = useCallback(
    (...args) => {
      if (autoClosingPanel) {
        handleCloseMenuPanel()
      }

      openApp(...args)

      // analytics
      // if an installed app clicked inside apps,
      // this handler will be re triggered,
      // but analytics is not required for apps' installed sub-page
      if (args.length === 1) {
        trackEvent(events.NAVIGATION_OPTION_SELECTED, {
          dao_identifier: daoAddress.domain || daoAddress.address,
          network: networkType,
          option:
            apps.find(obj => obj.proxyAddress === args[0])?.name || args[0],
        })
      }
    },
    [
      autoClosingPanel,
      handleCloseMenuPanel,
      openApp,
      daoAddress,
      networkType,
      apps,
    ]
  )

  const openNetworkModal = useCallback(() => setNetworkModalOpened(true), [])

  const closeNetworkSwitchModal = () => setNetworkModalOpened(false)

  const handleUpgradeModalOpen = useCallback(() => {
    setUpgradeModalOpened(true)
  }, [])

  const handleUpgradeModalClose = useCallback(() => {
    setUpgradeModalOpened(false)
  }, [])

  const showOrgUpgradePanel = useCallback(() => {
    // Only open the upgrade panel if the org can be upgraded
    setOrgUpgradePanelOpened(canUpgradeOrg)
    setUpgradeModalOpened(false)
  }, [canUpgradeOrg])

  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen(opened => !opened),
    []
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
    <div
      css={`
        display: ${visible ? 'flex' : 'none'};
        flex-direction: column;
        position: relative;
        z-index: 0;
        height: 100vh;
        min-width: ${45 * GU}px;
      `}
    >
      <div
        css={`
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        `}
      >
        <UpgradeBanner
          visible={canUpgradeOrg}
          onMoreInfo={handleUpgradeModalOpen}
        />
      </div>
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
          <TopbarContainer
            iosMenuPane={menuPanelOpen && iOS}
            bgColor={theme.surface}
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
            <RightButtonContainer>
              <NetworkIndicator clickHandler={openNetworkModal} />
              <AccountModule />
              <GlobalPreferencesButton />
              <ActivityButton apps={apps} />
            </RightButtonContainer>
          </TopbarContainer>
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
                  <OrgViewApp
                    apps={apps}
                    appInstanceGroups={appInstanceGroups}
                    appsStatus={appsStatus}
                    canUpgradeOrg={canUpgradeOrg}
                    daoAddress={daoAddress}
                    daoStatus={daoStatus}
                    historyBack={historyBack}
                    onOpenApp={handleOpenApp}
                    onShowOrgUpgradePanel={showOrgUpgradePanel}
                    onUpgradeModalOpen={handleUpgradeModalOpen}
                    permissionsLoading={permissionsLoading}
                    repos={repos}
                    wrapper={wrapper}
                  />

                  <SignerPanel
                    apps={apps}
                    transactionBag={transactionBag}
                    signatureBag={signatureBag}
                    web3={web3}
                  />

                  {canUpgradeOrg && (
                    <UpgradeOrganizationPanel
                      daoAddress={daoAddress}
                      opened={orgUpgradePanelOpened}
                      onClose={hideOrgUpgradePanel}
                      repos={repos}
                      wrapper={wrapper}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppWidthContext.Provider>
      <NetworkSwitchModal
        visible={networkModalOpened}
        onClose={closeNetworkSwitchModal}
      />
      <UpgradeModal
        visible={upgradeModalOpened}
        onClose={handleUpgradeModalClose}
        onUpgrade={showOrgUpgradePanel}
        canUpgradeOrg={canUpgradeOrg}
      />
    </div>
  )
}

// TODO extract topbar into proper component [vr 16-09-2021]
/* NOTE: Behaviour only in iOS:
 * With the nested div->div->div structure the 3rd div has absolute position in
 * Chrome, Firefox and Safari. Such div gets rendered above the rest of the
 * content (up the tree till a position relative is found) but in iOS it gets
 * rendered below the sibling of the element with position relative (and z-index
 * did not work) this fix gives the element an absolute position (z-index layers
 * are then respected); this also adds the appropriate value to recover the
 * elements height.
 * */
const TopbarContainer = styled.div`
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  height: ${8 * GU}px;
  display: flex;
  justify-content: space-between;
  background: ${props => props.bgColor};
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);

  ${props =>
    props.iosMenuPanel
      ? `
          position: absolute;
          width: 100%;
          z-index: 0;
        `
      : ''}
`

const RightButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 16px;
  height: 100%;"
`
OrgView.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsStatus: AppsStatusType.isRequired,
  canUpgradeOrg: PropTypes.bool,
  daoAddress: DaoAddressType.isRequired,
  daoStatus: DaoStatusType.isRequired,
  historyBack: PropTypes.func.isRequired,
  permissionsLoading: PropTypes.bool.isRequired,
  repos: PropTypes.arrayOf(RepoType).isRequired,
  signatureBag: PropTypes.object,
  transactionBag: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  web3: PropTypes.object,
  wrapper: AragonType,
}

OrgView.defaultProps = {
  transactionBag: null,
  signatureBag: null,
}

export { AppWidthContext }
export default OrgView
