import React, { useEffect, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AppType, AragonType } from '../../prop-types'
import { Button, GU, Header, IconPlus, Layout, useLayout } from '@aragon/ui'
import { addressesEqual, isAddress } from '../../web3-utils'
import { usePermissions } from '../../contexts/PermissionsContext'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import useAppWidth from '../useAppWidth'
import Home from './Home/Home'
import AppPermissions from './AppPermissions'
import AssignPermissionPanel from './AssignPermissionPanel'
import ManageRolePanel from './ManageRolePanel'

const HOME_TABS = ['App permissions', 'System permissions']

function getAppByProxyAddress(proxyAddress, apps) {
  if (!proxyAddress) {
    return null
  }
  return apps.find(app => addressesEqual(app.proxyAddress, proxyAddress))
}

function getLocation(localPath, apps) {
  const home = { screen: 'home' }

  if (!localPath) {
    return home
  }

  const [
    screen,
    data = null,
    secondaryScreen = null,
    secondaryData = null,
  ] = localPath.split('/')

  if (screen === 'app' && isAddress(data)) {
    return {
      screen,
      app: getAppByProxyAddress(data, apps),
      secondaryScreen,
      secondaryData,
    }
  }

  if (screen === 'role') {
    const appAddress = (data || '').slice(0, 42)
    const roleBytes = (data || '').slice(42)
    if (isAddress(appAddress))
      return {
        screen: 'home',
        app: getAppByProxyAddress(appAddress, apps),
        secondaryScreen: 'role',
        secondaryData: roleBytes,
      }
  }

  return home
}

function Permissions({
  apps,
  appsLoading,
  onPathRequest,
  localPath,
  permissionsLoading,
  wrapper,
}) {
  const { layoutName } = useLayout()
  const [showAssignPermissionPanel, setShowAssignPermissionPanel] = useState(
    false
  )
  const { resolveRole } = usePermissions()
  const scrollTopElement = useRef(null)

  const [homeTab, setHomeTab] = useState(0)

  // `localPath` should change every time we navigate into and out of a detailed
  // permissions view, so this ensures the user starts at the top of the screen
  // on every navigation change
  useEffect(() => {
    scrollTopElement.current.scrollIntoView()
  }, [localPath])

  const location = getLocation(localPath, apps)

  const openHome = useCallback(() => {
    onPathRequest('/')
  }, [onPathRequest])

  const openApp = useCallback(
    proxyAddress => {
      onPathRequest(`/app/${proxyAddress}`)
    },
    [onPathRequest]
  )

  const manageRole = useCallback(
    (proxyAddress, roleBytes) => {
      onPathRequest(
        location.screen === 'app'
          ? `/app/${proxyAddress}/role/${roleBytes}`
          : `/role/${proxyAddress}${roleBytes}`
      )
    },
    [onPathRequest, location]
  )

  const createPermission = useCallback(() => {
    setShowAssignPermissionPanel(true)
  }, [])

  const closeAssignPermissionPanel = useCallback(() => {
    setShowAssignPermissionPanel(false)
  }, [])

  const closeManageRolePanel = useCallback(() => {
    const location = getLocation(localPath, apps)
    const openedApp = location.screen === 'app' ? location.app : null
    if (openedApp) {
      openApp(openedApp.proxyAddress)
    } else {
      openHome()
    }
  }, [apps, localPath, onPathRequest, openApp])

  const managedRole =
    location.app && location.secondaryScreen === 'role'
      ? resolveRole(location.app.proxyAddress, location.secondaryData)
      : null

  return (
    <React.Fragment>
      <div
        css={`
          // This element is only used to reset
          // the view scroll using scrollIntoView()
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
        `}
        ref={scrollTopElement}
      />

      <Header
        primary={
          location.screen === 'app' && location.app ? (
            <Header.Title>
              <div
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <div
                  css={`
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: ${2 * GU}px;
                  `}
                >
                  {`${location.app.name} permissions`}
                </div>
                <LocalIdentityBadge
                  entity={location.app.proxyAddress}
                  shorten
                />
              </div>
            </Header.Title>
          ) : (
            'Permissions'
          )
        }
        secondary={
          <Button
            mode="strong"
            onClick={createPermission}
            label="New permission"
            icon={<IconPlus />}
            display={layoutName === 'small' ? 'icon' : 'label'}
            disabled={appsLoading || permissionsLoading}
          />
        }
      />

      {location.screen === 'home' && (
        <Home
          apps={apps}
          appsLoading={appsLoading}
          onChangeTab={setHomeTab}
          onManageRole={manageRole}
          onOpenApp={openApp}
          permissionsLoading={permissionsLoading}
          selectedTab={homeTab}
          tabs={HOME_TABS}
        />
      )}

      {location.screen === 'app' && (
        <AppPermissions
          app={location.app}
          loading={appsLoading}
          onBack={openHome}
          onManageRole={manageRole}
        />
      )}

      <AssignPermissionPanel
        apps={apps}
        opened={showAssignPermissionPanel}
        onClose={closeAssignPermissionPanel}
        wrapper={wrapper}
      />

      <ManageRolePanel
        app={location.app}
        apps={apps}
        opened={managedRole !== null}
        onClose={closeManageRolePanel}
        role={managedRole}
        wrapper={wrapper}
      />
    </React.Fragment>
  )
}

Permissions.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  onPathRequest: PropTypes.func.isRequired,
  localPath: PropTypes.string,
  permissionsLoading: PropTypes.bool.isRequired,
  wrapper: AragonType,
}

export default props => {
  const appWidth = useAppWidth()
  return (
    <Layout parentWidth={appWidth}>
      <Permissions {...props} />
    </Layout>
  )
}
