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

// props that are directly converted to state
const PROPS_TO_STATE = ['apps', 'permissions', 'wrapper']

class PermissionsProvider extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // Filter the received props
    const updateEntries = Object.entries(props).filter(
      ([key, value]) => PROPS_TO_STATE.includes(key) && value !== state[key]
    )

    if (updateEntries.length === 0) {
      return null
    }

    const update = objectFromEntries(updateEntries)

    // Update the entity / role resolvers on apps update
    if (update.apps) {
      update.resolveEntity = entityResolver(update.apps)
      update.resolveRole = roleResolver(update.apps)
    }

    return update
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
    const { permissions, resolveEntity, resolveRole } = this.state
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
    const { permissions, resolveEntity, resolveRole } = this.state
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
    const { permissions, resolveEntity, getEntityRoles } = this.state

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

    // coming from the props
    apps: {},
    permissions: {},
    wrapper: null,
  }

  render() {
    const { children } = this.props
    return <Provider value={this.state}>{children}</Provider>
  }
}

export { PermissionsProvider, Consumer as PermissionsConsumer }
