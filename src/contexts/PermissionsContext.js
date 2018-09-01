import React from 'react'
import {
  appRoles,
  entityResolver,
  roleResolver,
  entityRoles,
  permissionsByEntity,
} from '../permissions'
import { objectFromEntries, log } from '../utils'
import { keccak256 } from '../web3-utils'

const { Provider, Consumer } = React.createContext()

class PermissionsProvider extends React.Component {
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

  async revokePermission({ entityAddress, proxyAddress, roleBytes }) {
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

  // create (set a manager) and grant a permission
  async createPermission({
    entityAddress,
    proxyAddress,
    roleId = '',
    roleBytes = null,
    manager,
  }) {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('createPermission', [
      entityAddress,
      proxyAddress,
      roleBytes || keccak256(roleId.trim()),
      manager,
    ])
    log('create tx:', transaction)
  }

  // grant a permission
  async grantPermission({ entityAddress, proxyAddress, roleBytes }) {
    const { wrapper } = this.props
    if (wrapper === null) {
      return
    }
    const transaction = await wrapper.performACLIntent('grantPermission', [
      entityAddress,
      proxyAddress,
      roleBytes,
    ])
    log('grant tx:', transaction)
  }

  // Get the roles assigned to an address
  getEntityRoles(address) {
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

  // Get the roles declared on an app
  getAppRoles(app) {
    const { resolveEntity, resolveRole } = this.state
    const { permissions } = this.props
    if (!(app && permissions && resolveEntity && resolveRole)) {
      return []
    }
    return appRoles(app, permissions, (entityAddress, roleBytes) => ({
      role: resolveRole(app.proxyAddress, roleBytes),
      entity: resolveEntity(entityAddress),
    }))
  }

  // Get a list of entities with the roles assigned to them
  getRolesByEntity() {
    const { resolveEntity, getEntityRoles } = this.state
    const { permissions } = this.props

    if (!(permissions && resolveEntity && getEntityRoles)) {
      return []
    }

    return Object.entries(permissionsByEntity(permissions))
      .map(([entityAddress, apps]) => {
        const entity = resolveEntity(entityAddress)
        const roles = getEntityRoles(entityAddress)
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

  state = {
    roles: [],
    revokePermission: this.revokePermission.bind(this),
    createPermission: this.createPermission.bind(this),
    grantPermission: this.grantPermission.bind(this),
    getEntityRoles: this.getEntityRoles.bind(this),
    getAppRoles: this.getAppRoles.bind(this),
    getRolesByEntity: this.getRolesByEntity.bind(this),
    apps: {},
  }

  render() {
    const { children, permissions, wrapper } = this.props
    return (
      <Provider value={{ ...this.state, permissions, wrapper }}>
        {children}
      </Provider>
    )
  }
}

export { PermissionsProvider, Consumer as PermissionsConsumer }
