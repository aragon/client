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

// Returns a function that resolves a role
// using the provided apps, and caching the result.
export function roleResolver(apps = []) {
  return memoize(
    (proxyAddress, roleBytes) => {
      const app = apps.find(app => app.proxyAddress === proxyAddress)
      if (!app || !app.roles) {
        return null
      }
      const role = app.roles.find(role => (role.bytes = roleBytes))
      return app.roles.find(role => (role.bytes = roleBytes))
    },
    (...args) => args[0] + args[1]
  )
}

// Returns a function that resolves an entity
// using the provided apps, and caching the result.
export function entityResolver(apps = []) {
  return memoize(
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
}
