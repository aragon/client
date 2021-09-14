import memoize from 'lodash.memoize'
import { addressesEqual } from './util/web3'

// Note that these two terms are slightly confusing artifacts of the ACL:
//   Any entity: If a permission is granted to "any entity", then any address can be seen as holding
//               that permission
//   Burn entity: If a role's permission manager is set as "burn entity", then it is assumed to be a
//               discarded and frozen role
export const ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'
const BURN_ENTITY = '0x0000000000000000000000000000000000000001'
const UNASSIGNED_ENTITY = '0x0000000000000000000000000000000000000000'
const KERNEL_ROLES = [
  {
    name: 'Manage apps',
    id: 'APP_MANAGER_ROLE',
    params: [],
    bytes: '0xb6d92708f3d4817afc106147d969e229ced5c46e65e0a5002a0d391287762bd0',
  },
]

export function getAnyEntity() {
  return ANY_ENTITY
}

export function getBurnEntity() {
  return BURN_ENTITY
}

export function getUnassignedEntity() {
  return UNASSIGNED_ENTITY
}

// Check if the address represents “Any address”
export function isAnyEntity(address) {
  return addressesEqual(address, ANY_ENTITY)
}

// Check if the address represents the “Burned address”
export function isBurnEntity(address) {
  return addressesEqual(address, BURN_ENTITY)
}

// Check if the address represents an unassigned entity (either non-existent or 0x00)
export function isUnassignedEntity(address) {
  return addressesEqual(address, UNASSIGNED_ENTITY)
}

// Get a role from the known roles (kernel)
export function getKnownRole(roleBytes) {
  for (const role of KERNEL_ROLES) {
    if (roleBytes === role.bytes) {
      return { appName: 'Kernel', role }
    }
  }
  return null
}

// Get a flattened list of all app permissions grouped by their roles,
// with their assigned entities (if any)
export function permissionsByRole(apps, permissions) {
  return apps
    .map(app => {
      const { proxyAddress: appAddress, roles = [] } = app
      const appPermissions = permissions[appAddress] || {}
      return roles.map(({ bytes: roleBytes }) => {
        const rolePermissions = appPermissions[roleBytes] || {}
        return {
          appAddress,
          roleBytes,
          entities: rolePermissions.allowedEntities || [],
          manager: rolePermissions.manager || getUnassignedEntity(),
        }
      })
    })
    .flat()
}

// Get the roles of an app.
export function appRoles(app, permissions) {
  const roles = permissions[app.proxyAddress]
  return roles
    ? Object.entries(roles).map(
        ([roleBytes, { allowedEntities, manager }]) => ({
          roleBytes,
          allowedEntities,
          manager,
        })
      )
    : []
}

// Resolves a role from its bytes to its description using the provided apps
function resolveRole(apps, appAddress, roleBytes) {
  const knownRole = getKnownRole(roleBytes)
  if (knownRole) {
    return knownRole.role
  }
  const app = apps.find(app => addressesEqual(app.proxyAddress, appAddress))
  if (!app || !app.roles) {
    return null
  }
  return app.roles.find(role => role.bytes === roleBytes)
}

// Resolves an entity using the provided apps
function resolveEntity(apps, address) {
  const entity = { address, type: 'address' }
  if (isAnyEntity(address)) {
    return { ...entity, type: 'any' }
  }
  if (isBurnEntity(address)) {
    return { ...entity, type: 'burn' }
  }
  if (isUnassignedEntity(address)) {
    return { ...entity, type: 'unassigned' }
  }
  const app = apps.find(app => addressesEqual(app.proxyAddress, address))
  return app ? { ...entity, app, type: 'app' } : entity
}

// Returns a function that resolves an entity, caching the results
export function entityResolver(apps = []) {
  return memoize(address => resolveEntity(apps, address))
}

// Returns a function that resolves an role, caching the results
export function roleResolver(apps = []) {
  return memoize(
    (appAddress, roleBytes) => resolveRole(apps, appAddress, roleBytes),
    (appAddress, roleBytes) => appAddress + roleBytes
  )
}
