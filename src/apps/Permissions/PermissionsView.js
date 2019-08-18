import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  ContextMenu,
  ContextMenuItem,
  DataView,
  IconTrash,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { usePermissions } from '../../contexts/PermissionsContext'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import PermissionsIdentityBadge from './PermissionsIdentityBadge'

function PermissionsView({ permissions, onManageRole, heading, showApps }) {
  const { layoutName } = useLayout()
  const willRenderEntryChild = useMemo(
    () => permissions.some(permission => permission.entities.length > 1),
    [permissions]
  )

  const fields = [
    'Action',
    'On app',
    { label: 'Assigned to entity', childStart: true },
    'Managed by',
  ]

  if (!showApps) {
    fields.splice(1, 1)
  }

  return (
    <DataView
      heading={heading}
      mode={
        layoutName === 'large' || (layoutName === 'medium' && !showApps)
          ? 'table'
          : 'list'
      }
      fields={permissions.length ? fields : []}
      entries={permissions}
      renderEntry={entry => renderEntry(entry, showApps)}
      renderEntryChild={willRenderEntryChild ? renderEntryChild : undefined}
      renderEntryActions={entry => (
        <EntryActions entry={entry} onManageRole={onManageRole} />
      )}
    />
  )
}

PermissionsView.propTypes = {
  heading: PropTypes.node,
  onManageRole: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
  showApps: PropTypes.bool.isRequired,
}

function renderEntry({ entities, app, role, manager }, showApps) {
  const cells = [
    <span
      css={`
        ${textStyle('body2')}
      `}
    >
      {role.name}
    </span>,
    <LocalIdentityBadge entity={app.proxyAddress} shorten />,
    <EntryEntities entities={entities} />,
    <PermissionsIdentityBadge entity={manager} />,
  ]

  if (!showApps) {
    cells.splice(1, 1)
  }

  return cells
}

function renderEntryChild({ entities, app, role }) {
  return entities.length < 2
    ? null
    : entities.map(entity => (
        <ChildEntity
          key={entity.address}
          appAddress={app.proxyAddress}
          entity={entity}
          roleBytes={role.bytes}
        />
      ))
}

/* eslint-disable react/prop-types */
function EntryActions({ entry, onManageRole }) {
  const { role, app } = entry
  const { proxyAddress } = app
  const roleBytes = role.bytes

  const handleManageRoleClick = useCallback(() => {
    onManageRole(proxyAddress, roleBytes)
  }, [roleBytes, proxyAddress, onManageRole])

  return (
    <ContextMenu>
      <ContextMenuItem onClick={handleManageRoleClick}>
        Manage role
      </ContextMenuItem>
    </ContextMenu>
  )
}
/* eslint-enable react/prop-types */

/* eslint-disable react/prop-types */
function ChildEntity({ appAddress, entity, roleBytes }) {
  const theme = useTheme()
  const { revokePermission } = usePermissions()

  const entityAddress = entity.address

  const handleRevokeButtonClick = useCallback(() => {
    revokePermission({ appAddress, entityAddress, roleBytes })
  }, [revokePermission, entityAddress, appAddress, roleBytes])

  return (
    <div
      key={entityAddress}
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <PermissionsIdentityBadge entity={entityAddress} />
      <ButtonIcon
        label="Revoke permission"
        mode="button"
        onClick={handleRevokeButtonClick}
        css={`
          color: ${theme.negative};
        `}
      >
        <IconTrash />
      </ButtonIcon>
    </div>
  )
}
/* eslint-enable react/prop-types */

/* eslint-disable react/prop-types */
function EntryEntities({ entities }) {
  if (entities.length === 1) {
    return <PermissionsIdentityBadge entity={entities[0].address} />
  }

  return (
    <span
      css={`
        ${textStyle('body2')}
      `}
    >
      {entities.length === 0 ? 'Not assigned' : `${entities.length} entities`}
    </span>
  )
}
/* eslint-enable react/prop-types */

export default PermissionsView
