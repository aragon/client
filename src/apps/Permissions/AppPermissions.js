import React from 'react'
import PropTypes from 'prop-types'
import { BackButton, Bar } from '@aragon/ui'
import { AppType, EthereumAddressType } from '../../prop-types'
import { usePermissionsByRole } from '../../contexts/PermissionsContext'
import EmptyBlock from './EmptyBlock'
import PermissionsView from './PermissionsView'

function AppPermissions({ onBack, app, loading, address, onManageRole }) {
  const permissions = usePermissionsByRole()

  const appPermissions = permissions.filter(
    permission =>
      permission.app && permission.app.proxyAddress === app.proxyAddress
  )

  if (loading) {
    return <EmptyBlock>Loading permissions…</EmptyBlock>
  }

  if (permissions.length === 0) {
    return <EmptyBlock>No permissions found.</EmptyBlock>
  }

  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>
      <PermissionsView
        heading="Available permissions"
        onManageRole={onManageRole}
        onOpenEntity={() => null}
        permissions={appPermissions}
        showApps={false}
      />
    </React.Fragment>
  )
}

AppPermissions.propTypes = {
  address: EthereumAddressType.isRequired,
  app: AppType, // may not be available if still loading
  loading: PropTypes.bool.isRequired,
  onManageRole: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default AppPermissions
