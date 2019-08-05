import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  DropDown,
  GU,
  IconSearch,
  TextInput,
  useLayout,
  useTheme,
} from '@aragon/ui'
import EmptyBlock from '../EmptyBlock'
import PermissionsView from '../PermissionsView'

const ENTITY_TYPES = ['All entities', 'Accounts', 'Apps']

function AllPermissions({ loading, permissions, onOpenEntity, onManageRole }) {
  const [selectedEntityType, setSelectedEntityType] = useState(-1)
  const [searchTerms, setSearchTerms] = useState('')

  const filteredPermissions = useMemo(() => {
    return (
      permissions

        // Filter by search terms
        .filter(permission => {
          const preparedSearchTerms = searchTerms.trim().toLowerCase()
          if (preparedSearchTerms === '') {
            return true
          }
          const roleName = permission.role.name.toLowerCase()
          const roleId = permission.role.id.toLowerCase()
          return (
            roleName.includes(preparedSearchTerms) ||
            roleId.includes(preparedSearchTerms)
          )
        })

        // Filter by account types
        .filter(permission => {
          // accounts
          if (selectedEntityType === 1) {
            return permission.entities.some(entity => entity.type !== 'app')
          }

          // apps
          if (selectedEntityType === 2) {
            return permission.entities.some(entity => entity.type === 'app')
          }

          return true
        })
    )
  }, [searchTerms, permissions, selectedEntityType])

  if (loading) {
    return <EmptyBlock>Loading permissions…</EmptyBlock>
  }

  if (permissions.length === 0) {
    return <EmptyBlock>No permissions found.</EmptyBlock>
  }

  return (
    <PermissionsView
      permissions={filteredPermissions}
      onOpenEntity={onOpenEntity}
      onManageRole={onManageRole}
      heading={
        <Heading
          selectedEntityType={selectedEntityType}
          onEntityTypeChange={setSelectedEntityType}
          searchTerms={searchTerms}
          onSearchTermsChange={setSearchTerms}
        />
      }
      showApps
    />
  )
}

AllPermissions.propTypes = {
  loading: PropTypes.bool.isRequired,
  onOpenEntity: PropTypes.func.isRequired,
  permissions: PropTypes.array,
}

function Heading({
  selectedEntityType,
  onEntityTypeChange,
  searchTerms,
  onSearchTermsChange,
}) {
  const { layoutName } = useLayout()
  const theme = useTheme()

  const handleSearchInputChange = useCallback(
    event => {
      onSearchTermsChange(event.target.value)
    },
    [onSearchTermsChange]
  )

  const handleEntityDropDownChange = useCallback(
    index => {
      onEntityTypeChange(index === 0 ? -1 : index)
    },
    [onEntityTypeChange]
  )

  if (layoutName !== 'large') {
    return null
  }

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <div
        css={`
          white-space: nowrap;
        `}
      >
        All assigned permissions
      </div>
      <div>
        <label
          css={`
            margin-right: ${2 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          <span
            css={`
              margin-right: ${2 * GU}px;
            `}
          >
            Entity type
          </span>
          <DropDown
            items={ENTITY_TYPES}
            selected={selectedEntityType}
            onChange={handleEntityDropDownChange}
          />
        </label>
        <TextInput
          css={`
            width: ${38 * GU}px;
          `}
          adornment={
            <IconSearch
              css={`
                color: ${theme.surfaceIcon};
              `}
            />
          }
          adornmentPosition="end"
          onChange={handleSearchInputChange}
          placeholder="Search by action or entity"
          value={searchTerms}
        />
      </div>
    </div>
  )
}

Heading.propTypes = {
  selectedEntityType: PropTypes.number.isRequired,
  onEntityTypeChange: PropTypes.func.isRequired,
  searchTerms: PropTypes.string.isRequired,
  onSearchTermsChange: PropTypes.func.isRequired,
}

export default AllPermissions
