import React from 'react'
import PropTypes from 'prop-types'
import { BackButton, Bar, textStyle } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { usePermissionsByRole } from '../../contexts/PermissionsContext'
import EmptyBlock from './EmptyBlock'
import PermissionsView from './PermissionsView'

function AppPermissions({ app, loading, onBack, onManageRole }) {
  const permissions = usePermissionsByRole()

  if (loading) {
    return <EmptyBlock>Loading permissions…</EmptyBlock>
  }

  const appPermissions = permissions.filter(
    permission =>
      permission.app && permission.app.proxyAddress === app.proxyAddress
  )

  if (appPermissions.length === 0) {
    return <EmptyBlock>No permissions found.</EmptyBlock>
  }

  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>
      <PermissionsView
        heading={
          <span
            css={`
              ${textStyle('body2')}
              font-weight: 600;
            `}
          >
            Available permissions
          </span>
        }
        onManageRole={onManageRole}
        permissions={appPermissions}
        showApps={false}
      />
    </React.Fragment>
  )
}

AppPermissions.propTypes = {
  app: AppType, // may not be available if still loading
  loading: PropTypes.bool.isRequired,
  onManageRole: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default AppPermissions
