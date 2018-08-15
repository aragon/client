import rawApps from './src/demo-apps.js'
import rawPermissions from './src/demo-permissions.js'

// Get a list of roles assigned to entities.
// Input:  app instances => roles => entities
// Output: entities => app instances => roles
function permissionsByEntity(permissions) {
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

function cachedRoleRetriever() {
  const byInstanceId = new WeakMap()
  return (apps, proxyAddress, roleBytes) => {
    const app = apps.find(app => app.proxyAddress === proxyAddress)
    if (!app || !app.roles) {
      return roleBytes
    }
    return app.roles.find(role => (role.bytes = roleBytes))
  }
}

function cachedEntityRetriever() {
  const entities = new WeakMap()
  return (apps, proxyAddress, roleBytes) => {
    const app = apps.find(app => app.proxyAddress === proxyAddress)
    if (!app || !app.roles) {
      return roleBytes
    }
    return app.roles.find(role => (role.bytes = roleBytes))
  }
}

function getPermissions(apps, rawPermissions) {
  console.log('BY ENTITIES', this.getPermissionsEntities(apps, rawPermissions))

  return Object.entries(rawPermissions).map(([entity, permissions]) => {
    const entityPermissions = { entity, permissions }

    // Permissions of the DAO itself?
    if (entity.toLowerCase() === this.state.daoAddress.toLowerCase()) {
      return { type: 'dao', ...entityPermissions }
    }

    // Permissions of an app?
    const app = apps.find(app => app.proxyAddress === entity)
    if (app) {
      return { type: 'app', ...entityPermissions, app }
    }

    // unknown
    return { type: 'unknown', ...entityPermissions }
  })
}

const permissions = permissionsByEntity(rawPermissions)
const getRole = cachedRoleRetriever()
const getEntity = cachedEntityRetriever()

console.log(
  Object.entries(permissions).reduce((permissions, [entity, apps]) => {
    permissions[entity] = Object.entries(apps).reduce((apps, [app, roles]) => {
      apps[app] = roles.map(role => {
        const { name, id } = getRole(rawApps, app, role)
        return name || role
      })
      return apps
    }, {})
    return permissions
  }, {})
)
