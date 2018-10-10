import React from 'react'
import {
  appPermissions,
  appRoles,
  entityResolver,
  roleResolver,
  entityRoles,
  permissionsByEntity,
} from '../permissions'
import { log, noop } from '../utils'
import { getEmptyAddress } from '../web3-utils'

const { Provider, Consumer } = React.createContext()

class PermissionsProvider extends React.Component {
  state = {
    roles: [],
    apps: {},
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

  revokePermission = async ({ entityAddress, proxyAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('revokePermission', [
      entityAddress,
      proxyAddress,
      roleBytes,
    ])
    log('revoke tx:', transaction)
  }

  // create a permission (= set a manager + grant a permission)
  createPermission = async ({
    entityAddress,
    proxyAddress,
    roleBytes = null,
    manager,
  }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    console.log('CREATE', [entityAddress, proxyAddress, roleBytes, manager])
    const transaction = await wrapper.performACLIntent('createPermission', [
      entityAddress,
      proxyAddress,
      roleBytes,
      manager,
    ])
    log('createPermission tx:', transaction)
  }

  grantPermission = async ({ entityAddress, proxyAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('grantPermission', [
      entityAddress,
      proxyAddress,
      roleBytes,
    ])
    log('grantPermission tx:', transaction)
  }

  removePermissionManager = async ({ proxyAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent(
      'removePermissionManager',
      [proxyAddress, roleBytes]
    )
    log('removePermissionManager tx:', transaction)
  }

  setPermissionManager = async ({ entityAddress, proxyAddress, roleBytes }) => {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('setPermissionManager', [
      entityAddress,
      proxyAddress,
      roleBytes,
    ])
    log('setPermissionManager tx:', transaction)
  }

  // Get the roles assigned to an address
  getEntityRoles = address => {
    const { resolveEntity, resolveRole } = this.state
    const { permissions } = this.props
    if (!(permissions && resolveEntity && resolveRole)) {
      return []
    }
    return entityRoles(
      address,
      permissionsByEntity(permissions),
      (roleBytes, proxyAddress) => ({
        role: resolveRole(proxyAddress, roleBytes),
        roleFrom: resolveEntity(proxyAddress),
        proxyAddress,
        roleBytes,
      })
    )
  }

  // Get the permissions declared on an app
  getAppPermissions = app => {
    const { resolveEntity, resolveRole } = this.state
    const { permissions } = this.props
    if (!(app && permissions && resolveEntity && resolveRole)) {
      return []
    }
    return appPermissions(app, permissions, (entityAddress, roleBytes) => ({
      role: resolveRole(app.proxyAddress, roleBytes),
      entity: resolveEntity(entityAddress),
    }))
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

  // Get a list of entities with the roles assigned to them
  getRolesByEntity = () => {
    const { resolveEntity } = this.state
    const { permissions } = this.props

    if (!(permissions && resolveEntity)) {
      return []
    }

    return Object.entries(permissionsByEntity(permissions))
      .map(([entityAddress, apps]) => {
        const entity = resolveEntity(entityAddress)
        const roles = this.getEntityRoles(entityAddress)
        return { entity, entityAddress, roles }
      })
      .sort((a, b) => {
        if (a.entity && a.entity.type === 'any') {
          return -1
        }
        if (b.entity && b.entity.type === 'any') {
          return 1
        }
        return 0
      })
  }

  render() {
    const { children, permissions, wrapper } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          permissions,
          wrapper,
          revokePermission: this.revokePermission,
          createPermission: this.createPermission,
          grantPermission: this.grantPermission,
          removePermissionManager: this.removePermissionManager,
          setPermissionManager: this.setPermissionManager,
          getEntityRoles: this.getEntityRoles,
          getAppPermissions: this.getAppPermissions,
          getAppRoles: this.getAppRoles,
          getRoleManager: this.getRoleManager,
          getRolesByEntity: this.getRolesByEntity,
        }}
      >
        {children}
      </Provider>
    )
  }
}

export { PermissionsProvider, Consumer as PermissionsConsumer }
