import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from '@aragon/ui'
import { AppType } from '../../../prop-types'
import { usePermissionsByRole } from '../../../contexts/PermissionsContext'
import Apps from './Apps'
import AllPermissions from './AllPermissions'

const TABS = ['App permissions', 'System permissions']

function Home({
  apps,
  appsLoading,
  permissionsLoading,
  onOpenApp,
  onOpenEntity,
}) {
  const [tab, setTab] = useState(0)
  const permissions = usePermissionsByRole()

  const internalAppsOnly = tab === 1

  const appsFiltered = apps.filter(
    app => Boolean(app.isAragonOsInternalApp) === internalAppsOnly
  )

  const permissionsFiltered = permissions.filter(
    permission =>
      permission.app &&
      Boolean(permission.app.isAragonOsInternalApp) === internalAppsOnly
  )

  return (
    <React.Fragment>
      <Tabs items={TABS} selected={tab} onChange={setTab} />
      <Apps apps={appsFiltered} loading={appsLoading} onOpenApp={onOpenApp} />
      <AllPermissions
        permissions={permissionsFiltered}
        loading={appsLoading || permissionsLoading}
        onOpenEntity={onOpenEntity}
      />
    </React.Fragment>
  )
}

Home.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  permissionsLoading: PropTypes.bool.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onOpenEntity: PropTypes.func.isRequired,
}

export default Home
