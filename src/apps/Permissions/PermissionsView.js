import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  ContextMenu,
  ContextMenuItem,
  DataView,
  IconCirclePlus,
  IconEdit,
  IconTrash,
  IconView,
  GU,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { usePermissions } from '../../contexts/PermissionsContext'
import LocalLabelAppBadge from '../../components/LocalLabelAppBadge/LocalLabelAppBadge'
import { getUnassignedEntity } from '../../permissions'
import PermissionsIdentityBadge from './PermissionsIdentityBadge'

const PermissionsView = React.memo(function PermissionsView({
  heading,
  onAssignPermission,
  onManageRole,
  onPageChange,
  page,
  permissions,
  showApps,
}) {
  const { layoutName } = useLayout()
  const willRenderEntryExpansion = useMemo(
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
      page={page}
      onPageChange={onPageChange}
      mode={
        layoutName === 'large' || (layoutName === 'medium' && !showApps)
          ? 'table'
          : 'list'
      }
      fields={permissions.length ? fields : []}
      entries={permissions}
      renderEntry={entry => renderEntry(entry, showApps)}
      renderEntryExpansion={
        willRenderEntryExpansion ? renderEntryExpansion : undefined
      }
      renderEntryActions={entry =>
        renderEntryActions(entry, onAssignPermission, onManageRole)
      }
    />
  )
})

PermissionsView.propTypes = {
  heading: PropTypes.node,
  onAssignPermission: PropTypes.func.isRequired,
  onManageRole: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
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
      {role.name ||
        role.id
          ?.toLowerCase()
          .split('_')
          .slice(0, -1)
          .join(' ')}
    </span>,
    <LocalLabelAppBadge app={app} apps={[]} noIdentifier />,
    <EntryEntities entities={entities} />,
    <EntityBadge entity={manager} />,
  ]

  if (!showApps) {
    cells.splice(1, 1)
  }

  return cells
}

function renderEntryExpansion({ entities, app, role }) {
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

function renderEntryActions(entry, onAssignPermission, onManageRole) {
  return (
    <EntryActions
      entry={entry}
      onAssignPermission={onAssignPermission}
      onManageRole={onManageRole}
    />
  )
}

/* eslint-disable react/prop-types */
function EntryActions({ entry, onAssignPermission, onManageRole }) {
  const theme = useTheme()
  const { revokePermission } = usePermissions()

  const { app, entities, manager, role } = entry
  const { proxyAddress } = app
  const { address: entityAddress } = entities[0] || {}
  const roleBytes = role.bytes

  const handleManageRole = useCallback(() => {
    onManageRole(proxyAddress, roleBytes)
  }, [roleBytes, proxyAddress, onManageRole])

  const handleRevokePermission = useCallback(() => {
    revokePermission({ appAddress: proxyAddress, entityAddress, roleBytes })
  }, [revokePermission, entityAddress, proxyAddress, roleBytes])

  const actions = []
  if (manager.type === 'burn') {
    actions.push([handleManageRole, IconView, 'View permission'])
  } else {
    if (manager.type === 'unassigned') {
      actions.push([
        handleManageRole,
        IconEdit,
        entities.length > 0 ? 'Re-initialize permission' : 'Create permission',
      ])
    } else {
      actions.push(
        ...[
          [handleManageRole, IconEdit, 'Manage role'],
          [onAssignPermission, IconCirclePlus, 'Assign permission'],
        ]
      )
    }

    if (entities.length === 1 && entityAddress) {
      actions.push([
        handleRevokePermission,
        IconTrash,
        'Revoke permission',
        theme.negative,
      ])
    }
  }

  return (
    <ContextMenu zIndex={2}>
      {actions.map(([onClick, Icon, label, color], index) => (
        <ContextMenuItem onClick={onClick} key={index}>
          <span
            css={`
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${color || theme.surfaceContentSecondary};
            `}
          >
            <Icon />
          </span>
          <span
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            {label}
          </span>
        </ContextMenuItem>
      ))}
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
      <EntityBadge entity={entity} />
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
    return <EntityBadge entity={entities[0]} />
  }

  return (
    <span
      css={`
        ${textStyle('body2')}
      `}
    >
      {entities.length === 0 ? (
        <PermissionsIdentityBadge entity={getUnassignedEntity()} />
      ) : (
        `${entities.length} entities`
      )}
    </span>
  )
}
/* eslint-enable react/prop-types */

/* eslint-disable react/prop-types */
function EntityBadge({ entity }) {
  if (entity.type === 'app') {
    return <LocalLabelAppBadge app={entity.app} apps={[]} noIdentifier />
  }

  return <PermissionsIdentityBadge entity={entity.address} />
}
/* eslint-enable react/prop-types */

export default PermissionsView
