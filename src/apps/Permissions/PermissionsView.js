import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  ContextMenu,
  ContextMenuItem,
  DataView,
  IconTrash,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { usePermissions } from '../../contexts/PermissionsContext'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'

function PermissionsView({
  permissions,
  onOpenEntity,
  onManageRole,
  heading,
  showApps,
}) {
  const { layoutName } = useLayout()

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
      fields={fields}
      entries={permissions}
      renderEntry={entry => renderEntry(entry, showApps)}
      renderEntryChild={renderEntryChild}
      renderEntryActions={entry => (
        <EntryActions entry={entry} onManageRole={onManageRole} />
      )}
    />
  )
}

PermissionsView.propTypes = {
  heading: PropTypes.node,
  onManageRole: PropTypes.func.isRequired,
  onOpenEntity: PropTypes.func.isRequired,
  permissions: PropTypes.array,
  showApps: PropTypes.bool.isRequired,
}

function renderEntry({ entities, app, role, manager }, showApps) {
  const cells = [
    role.name,
    <LocalIdentityBadge entity={app.proxyAddress} shorten />,
    <EntryEntities entities={entities} />,
    <LocalIdentityBadge entity={manager} />,
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
          entity={entity}
          proxyAddress={app.proxyAddress}
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
function ChildEntity({ entity, proxyAddress, roleBytes }) {
  const theme = useTheme()

  const { revokePermission } = usePermissions()

  const entityAddress = entity.address

  const handleRevokeButtonClick = useCallback(() => {
    revokePermission({ entityAddress, proxyAddress, roleBytes })
  }, [revokePermission, entityAddress, proxyAddress, roleBytes])

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
      <LocalIdentityBadge entity={entityAddress} />
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

// eslint-disable-next-line react/prop-types
function EntryEntities({ entities }) {
  if (entities.length === 0) {
    return 'Not assigned'
  }

  if (entities.length === 1) {
    return (
      <LocalIdentityBadge
        entity={
          entities[0].type === 'any' ? 'Any account' : entities[0].address
        }
      />
    )
  }

  return `${entities.length} entities`
}

export default PermissionsView
