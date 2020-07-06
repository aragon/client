import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from '@aragon/ui'
import { AppType } from '../../../prop-types'
import { usePermissionsByRole } from '../../../contexts/PermissionsContext'
import Apps from './Apps'
import AllPermissions from './AllPermissions'

function Home({
  apps,
  appsLoading,
  onAssignPermission,
  onChangeTab,
  onManageRole,
  onOpenApp,
  permissionsLoading,
  tabs,
  selectedTab,
}) {
  const permissions = usePermissionsByRole()

  const internalAppsOnly = selectedTab === 1

  const appsFiltered = apps.filter(
    app => Boolean(app.isAragonOsInternalApp) === internalAppsOnly
  )

  const permissionsFiltered = useMemo(
    () =>
      permissions.filter(
        permission =>
          permission.app &&
          (permission.entities.length > 0 ||
            permission.manager.type !== 'unassigned') &&
          Boolean(permission.app.isAragonOsInternalApp) === internalAppsOnly
      ),
    [permissions, internalAppsOnly]
  )

  return (
    <React.Fragment>
      <Tabs items={tabs} selected={selectedTab} onChange={onChangeTab} />
      <Apps apps={appsFiltered} loading={appsLoading} onOpenApp={onOpenApp} />
      <AllPermissions
        permissions={permissionsFiltered}
        loading={appsLoading || permissionsLoading}
        onAssignPermission={onAssignPermission}
        onManageRole={onManageRole}
      />
    </React.Fragment>
  )
}

Home.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  permissionsLoading: PropTypes.bool.isRequired,
  onAssignPermission: PropTypes.func.isRequired,
  onManageRole: PropTypes.func.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTab: PropTypes.number.isRequired,
}

export default Home
