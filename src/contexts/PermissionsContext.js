import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../prop-types'
import {
  appRoles,
  entityResolver,
  roleResolver,
  permissionsByRole,
} from '../permissions'
import { log, noop } from '../util/utils'
import { addressesEqual, getEmptyAddress } from '../util/web3'

const PermissionsContext = React.createContext()

class PermissionsProvider extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    children: PropTypes.node.isRequired,
    permissions: PropTypes.object.isRequired,
    wrapper: PropTypes.object,
  }

  state = {
    roles: [],
    apps: [],
    resolveEntity: noop,
    resolveRole: noop,
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.apps || props.apps === state.apps) {
      return null
    }

    return {
      apps: props.apps,
      resolveEntity: entityResolver(props.apps),
      resolveRole: roleResolver(props.apps),
    }
  }

  revokePermission = async ({ appAddress, entityAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('revokePermission', [
      entityAddress,
      appAddress,
      roleBytes,
    ])
    log('revokePermission tx:', transaction)
  }

  // create a permission (= set a manager + grant a permission)
  createPermission = async ({
    appAddress,
    entityAddress,
    roleBytes = null,
    manager,
  }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    log('createPermission', [entityAddress, appAddress, roleBytes, manager])
    const transaction = await wrapper.performACLIntent('createPermission', [
      entityAddress,
      appAddress,
      roleBytes,
      manager,
    ])
    log('createPermission tx:', transaction)
  }

  grantPermission = async ({ appAddress, entityAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('grantPermission', [
      entityAddress,
      appAddress,
      roleBytes,
    ])
    log('grantPermission tx:', transaction)
  }

  removePermissionManager = async ({ appAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent(
      'removePermissionManager',
      [appAddress, roleBytes]
    )
    log('removePermissionManager tx:', transaction)
  }

  setPermissionManager = async ({ entityAddress, appAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('setPermissionManager', [
      entityAddress,
      appAddress,
      roleBytes,
    ])
    log('setPermissionManager tx:', transaction)
  }

  // Get the roles of an app
  getAppRoles = app => {
    const { resolveRole } = this.state
    const { permissions } = this.props
    return app
      ? appRoles(app, permissions).map(role => ({
          ...role,
          role: resolveRole(app.proxyAddress, role.roleBytes),
        }))
      : []
  }

  // Get the manager of a role
  getRoleManager = (app, roleBytes) => {
    const { resolveEntity } = this.state
    const role = this.getAppRoles(app).find(
      role => role.roleBytes === roleBytes
    )
    return resolveEntity((role && role.manager) || getEmptyAddress())
  }

  render() {
    const { children, permissions } = this.props
    return (
      <PermissionsContext.Provider
        value={{
          ...this.state,
          permissions,
          getAppRoles: this.getAppRoles,
          createPermission: this.createPermission,
          getRoleManager: this.getRoleManager,
          grantPermission: this.grantPermission,
          removePermissionManager: this.removePermissionManager,
          revokePermission: this.revokePermission,
          setPermissionManager: this.setPermissionManager,
        }}
      >
        {children}
      </PermissionsContext.Provider>
    )
  }
}

const PermissionsConsumer = PermissionsContext.Consumer

function usePermissions() {
  return useContext(PermissionsContext)
}

function usePermissionsByRole() {
  const { apps, permissions, resolveRole, resolveEntity } = usePermissions()

  return useMemo(
    () =>
      permissionsByRole(apps, permissions).map(
        ({ appAddress, entities, manager, roleBytes, ...permission }) => {
          const app = apps.find(app =>
            addressesEqual(app.proxyAddress, appAddress)
          )
          return {
            ...permission,
            app: app || null,
            entities: entities.map(resolveEntity),
            manager: resolveEntity(manager),
            role: resolveRole(appAddress, roleBytes),
          }
        }
      ),
    [apps, permissions, resolveRole, resolveEntity]
  )
}

export {
  PermissionsProvider,
  PermissionsConsumer,
  usePermissions,
  usePermissionsByRole,
}
