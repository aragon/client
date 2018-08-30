import memoize from 'lodash.memoize'

const ANY_ADDRESS = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

const KERNEL_ROLES = {
  appName: 'Kernel',
  roles: [
    {
      name: 'Manage apps',
      id: 'APP_MANAGER_ROLE',
      params: [],
      bytes:
        '0xb6d92708f3d4817afc106147d969e229ced5c46e65e0a5002a0d391287762bd0',
    },
  ],
}

const ACL_ROLES = {
  appName: 'ACL',
  roles: [
    {
      name: 'Create permissions',
      id: 'CREATE_PERMISSIONS_ROLE',
      params: [],
      bytes:
        '0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a',
    },
  ],
}

// Get a role from the known roles (see KNOWN_ROLES)
export const getKnownRole = roleBytes => {
  for (const group of [KERNEL_ROLES, ACL_ROLES]) {
    for (const role of group.roles) {
      if (roleBytes === role.bytes) {
        return { appName: group.appName, role }
      }
    }
  }
  return null
}

// Get a list of roles assigned to entities.
// Input:  app instances => roles => entities
// Output: entities => app instances => roles
export function permissionsByEntity(permissions) {
  const results = {}
  // apps
  for (const [app, appPermissions] of Object.entries(permissions)) {
    // roles
    for (const [role, { allowedEntities }] of Object.entries(appPermissions)) {
      // entities
      for (const entity of allowedEntities) {
        if (!results[entity]) {
          results[entity] = {}
        }
        results[entity][app] = [...(results[entity][app] || []), role]
      }
    }
  }
  return results
}

// Get the roles attached to an entity.
export const entityRoles = (
  entityAddress,
  permissionsByEntity,
  transform = (role, proxyAddress) => role
) =>
  permissionsByEntity[entityAddress]
    ? Object.entries(permissionsByEntity[entityAddress]).reduce(
        (roles, [proxyAddress, appRoles]) =>
          roles.concat(appRoles.map(role => transform(role, proxyAddress))),
        []
      )
    : null

// Get the roles attached to an app.
export const appRoles = (
  app,
  permissions,
  transform = (entity, role) => [entity, role]
) =>
  Object.entries(permissions[app.proxyAddress])
    .reduce(
      (roles, [role, { allowedEntities }]) =>
        roles.concat(allowedEntities.map(entity => transform(entity, role))),
      []
    )
    .filter(Boolean)
  

// Returns a function that resolves a role
// using the provided apps, and caching the result.
export const roleResolver = (apps = []) =>
  memoize(
    (proxyAddress, roleBytes) => {
      const knownRole = getKnownRole(roleBytes)
      if (knownRole) {
        return knownRole.role
      }

      const app = apps.find(app => app.proxyAddress === proxyAddress)
      if (!app || !app.roles) {
        return null
      }
      return app.roles.find(role => role.bytes === roleBytes)
    },
    (...args) => args[0] + args[1]
  )

// Returns a function that resolves an entity
// using the provided apps, and caching the result.
export const entityResolver = (apps = []) =>
  memoize(
    (address, daoAddress) => {
      const entity = { address, type: 'address' }
      if (address === daoAddress) {
        return { ...entity, type: 'dao' }
      }
      if (address === ANY_ADDRESS) {
        return { ...entity, type: 'any' }
      }
      const app = apps.find(app => app.proxyAddress === address)
      return app ? { ...entity, type: 'app', app } : entity
    },
    (...args) => args[0] + args[1]
  )
