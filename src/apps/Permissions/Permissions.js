import React, { useEffect, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AppType, AragonType } from '../../prop-types'
import { Button, GU, Header, Layout } from '@aragon/ui'
import { addressesEqual, isAddress } from '../../web3-utils'
import { usePermissions } from '../../contexts/PermissionsContext'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { useAppWidth } from '../../components/OrgView/OrgView'
import Home from './Home/Home'
import AppPermissions from './AppPermissions'
import AssignPermissionPanel from './AssignPermissionPanel'
import ManageRolePanel from './ManageRolePanel'

function getAppByProxyAddress(proxyAddress, apps) {
  if (!proxyAddress) {
    return null
  }
  return apps.find(app => addressesEqual(app.proxyAddress, proxyAddress))
}

function getLocation(params, apps) {
  const home = { screen: 'home' }

  if (!params) {
    return home
  }

  // Not using "/" as a separator because
  // it would get encoded by encodeURIComponent().
  const [
    screen,
    data = null,
    secondaryScreen = null,
    secondaryData = null,
  ] = params.split('.')

  if (screen === 'app' && isAddress(data)) {
    return {
      screen,
      address: data,
      app: getAppByProxyAddress(data, apps),
      secondaryScreen,
      secondaryData,
    }
  }

  if (screen === 'entity' && isAddress(data)) {
    return { screen, address: data }
  }

  return home
}

function Permissions({
  apps,
  appsLoading,
  onParamsRequest,
  params,
  permissionsLoading,
  wrapper,
}) {
  const [showAssignPermissionPanel, setShowAssignPermissionPanel] = useState(
    false
  )
  const { resolveRole } = usePermissions()
  const scrollTopElement = useRef(null)

  useEffect(() => {
    scrollTopElement.current.scrollIntoView()
  }, [params])

  const openHome = useCallback(() => {
    onParamsRequest(null)
  }, [onParamsRequest])

  const openApp = useCallback(
    proxyAddress => {
      onParamsRequest(`app.${proxyAddress}`)
    },
    [onParamsRequest]
  )

  const openEntity = useCallback(
    address => {
      if (getAppByProxyAddress(address, apps)) {
        return openApp(address)
      }
      onParamsRequest(`entity.${address}`)
    },
    [apps, onParamsRequest, openApp]
  )

  const manageRole = useCallback(
    (proxyAddress, roleBytes) => {
      onParamsRequest(`app.${proxyAddress}.role.${roleBytes}`)
    },
    [onParamsRequest]
  )

  const createPermission = useCallback(() => {
    setShowAssignPermissionPanel(true)
  }, [])

  const closeAssignPermissionPanel = useCallback(() => {
    setShowAssignPermissionPanel(false)
  }, [])

  const closeManageRolePanel = useCallback(() => {
    const location = getLocation(params, apps)
    const openedApp = location.screen === 'app' ? location.app : null
    if (openedApp) {
      onParamsRequest(`app.${openedApp.proxyAddress}`)
    }
  }, [apps, params, onParamsRequest])

  const location = getLocation(params, apps)

  const managedRole =
    location.screen === 'app' &&
    location.app &&
    location.secondaryScreen === 'role'
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
              <span
                css={`
                  margin-right: ${2 * GU}px;
                `}
              >{`${location.app.name} permissions`}</span>
              <LocalIdentityBadge entity={location.app.proxyAddress} shorten />
            </Header.Title>
          ) : (
            'Permissions'
          )
        }
        secondary={
          <Button
            mode="strong"
            onClick={createPermission}
            disabled={appsLoading || permissionsLoading}
          >
            New permission
          </Button>
        }
      />

      {location.screen === 'home' && (
        <Home
          apps={apps}
          appsLoading={appsLoading}
          permissionsLoading={permissionsLoading}
          onOpenApp={openApp}
          onOpenEntity={openEntity}
        />
      )}

      {location.screen === 'app' && (
        <AppPermissions
          app={location.app}
          loading={appsLoading}
          address={location.address}
          onManageRole={manageRole}
          onBack={openHome}
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
      />
    </React.Fragment>
  )
}

Permissions.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  onParamsRequest: PropTypes.func.isRequired,
  params: PropTypes.string,
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
