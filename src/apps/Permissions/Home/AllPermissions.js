import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  DropDown,
  GU,
  SearchInput,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import debounce from 'lodash.debounce'
import EmptyBlock from '../EmptyBlock'
import EmptyFilteredPermission from '../EmptyFilteredPermissions'
import PermissionsView from '../PermissionsView'

const ENTITY_TYPES = ['All entities', 'Accounts', 'Apps']

function AllPermissions({
  loading,
  onAssignPermission,
  onManageRole,
  permissions,
}) {
  const [selectedEntityType, setSelectedEntityType] = useState(-1)
  const [searchTerms, setSearchTerms] = useState('')
  const [page, setPage] = useState(0)
  const { layoutName } = useLayout()

  const permissionsKey = permissions
    .map(permission => `${permission.app.proxyAddress}-${permission.role.id}`)
    .join(',')

  useEffect(() => {
    setPage(0)
  }, [permissionsKey])

  const handleEntityTypeChange = useCallback(entity => {
    setPage(0)
    setSelectedEntityType(entity)
  }, [])

  const handlSearchTermsChange = useCallback(terms => {
    setPage(0)
    setSearchTerms(terms)
  }, [])

  const filteredPermissions = useMemo(() => {
    return (
      permissions

        // Filter by search terms
        .filter(permission => {
          const preparedSearchTerms = searchTerms.trim().toLowerCase()
          if (preparedSearchTerms === '') {
            return true
          }
          const appName = permission.app.name.toLowerCase()
          const roleName = permission.role.name.toLowerCase()
          const roleId = permission.role.id.toLowerCase()
          return (
            appName.includes(preparedSearchTerms) ||
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
    return <EmptyBlock>No permissions have been assigned yet.</EmptyBlock>
  }

  return (
    <PermissionsView
      permissions={filteredPermissions}
      onAssignPermission={onAssignPermission}
      onManageRole={onManageRole}
      page={page}
      onPageChange={setPage}
      heading={
        layoutName === 'large' && (
          <Heading
            emptyFilter={Boolean(
              !filteredPermissions.length && permissions.length
            )}
            selectedEntityType={selectedEntityType}
            onEntityTypeChange={handleEntityTypeChange}
            searchTerms={searchTerms}
            onSearchTermsChange={handlSearchTermsChange}
          />
        )
      }
      showApps
    />
  )
}

AllPermissions.propTypes = {
  loading: PropTypes.bool.isRequired,
  onAssignPermission: PropTypes.func.isRequired,
  onManageRole: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
}

function Heading({
  emptyFilter,
  selectedEntityType,
  onEntityTypeChange,
  searchTerms,
  onSearchTermsChange,
}) {
  const theme = useTheme()
  const [searchTermsInputValue, setSearchTermsInputValue] = useState(
    searchTerms
  )

  const debouncedSearchTermsUpdate = useCallback(
    debounce(value => onSearchTermsChange(value), 300),
    [onSearchTermsChange]
  )

  const handleEntityDropDownChange = useCallback(
    index => {
      onEntityTypeChange(index || -1)
    },
    [onEntityTypeChange]
  )

  const handleSearchInputChange = useCallback(
    value => {
      // immediately update the text field
      setSearchTermsInputValue(value)
      // but debounce the external update
      debouncedSearchTermsUpdate(value)
    },
    [debouncedSearchTermsUpdate]
  )

  const handleOnClear = useCallback(() => {
    onEntityTypeChange(-1)
    onSearchTermsChange('')
    setSearchTermsInputValue('')
  }, [onEntityTypeChange, onSearchTermsChange])

  return (
    <React.Fragment>
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
            ${textStyle('body1')}
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
            <DropDown
              header="Entity"
              placeholder="Entity"
              items={ENTITY_TYPES}
              selected={selectedEntityType}
              onChange={handleEntityDropDownChange}
              css={`
                min-width: ${16 * GU}px;
              `}
            />
          </label>
          <SearchInput
            css={`
              width: ${38 * GU}px;
            `}
            onChange={handleSearchInputChange}
            placeholder="Search by app or role"
            value={searchTermsInputValue}
          />
        </div>
      </div>
      {emptyFilter && <EmptyFilteredPermission onClear={handleOnClear} />}
    </React.Fragment>
  )
}

Heading.propTypes = {
  emptyFilter: PropTypes.bool,
  selectedEntityType: PropTypes.number.isRequired,
  onEntityTypeChange: PropTypes.func.isRequired,
  searchTerms: PropTypes.string.isRequired,
  onSearchTermsChange: PropTypes.func.isRequired,
}

export default AllPermissions
