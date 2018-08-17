import memoize from 'lodash.memoize'

const ANY_ADDRESS = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

// Get a list of roles assigned to entities.
// Input:  app instances => roles => entities
// Output: entities => app instances => roles
export function permissionsByEntity(permissions) {
  const results = {}
  // apps
  for (const [app, appPermissions] of Object.entries(permissions)) {
    // roles
    for (const [role, entities] of Object.entries(appPermissions)) {
      // entities
      for (const entity of entities) {
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
  Object.entries(permissionsByEntity[entityAddress])
    .reduce(
      (roles, [proxyAddress, appRoles]) =>
        roles.concat(appRoles.map(role => transform(role, proxyAddress))),
      []
    )
    .filter(Boolean)

// Get the roles attached to an app.
export const appRoles = (
  app,
  permissions,
  transform = (entity, role) => [entity, role]
) =>
  Object.entries(permissions[app.proxyAddress])
    .reduce(
      (roles, [role, entities]) =>
        roles.concat(entities.map(entity => transform(entity, role))),
      []
    )
    .filter(Boolean)

// Returns a function that resolves a role
// using the provided apps, and caching the result.
export const roleResolver = (apps = []) =>
  memoize((proxyAddress, roleBytes) => {
    const app = apps.find(app => app.proxyAddress === proxyAddress)
    if (!app || !app.roles) {
      return null
    }
    return app.roles.find(role => role.bytes === roleBytes)
  }, (...args) => args[0] + args[1])

// Returns a function that resolves an entity
// using the provided apps, and caching the result.
export const entityResolver = (apps = []) =>
  memoize((address, daoAddress) => {
    const entity = { address, type: 'address' }
    if (address === daoAddress) {
      return { ...entity, type: 'dao' }
    }
    if (address === ANY_ADDRESS) {
      return { ...entity, type: 'any' }
    }
    const app = apps.find(app => app.proxyAddress === address)
    return app ? { ...entity, type: 'app', app } : entity
  }, (...args) => args[0] + args[1])
