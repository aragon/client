const ANY_ADDRESS = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

const CORE_APPS = new Map([
  [
    '0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a',
    { name: 'ACL' },
  ],
  [
    '0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61',
    { name: 'EVM Script Registry' },
  ],
])

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

export function getCoreApp(appId) {
  return CORE_APPS.get(appId)
}

export function isCoreApp(appId) {
  return CORE_APPS.has(appId)
}

export function getCoreRoles() {
  return [KERNEL_ROLES, ACL_ROLES]
}

export function isAnyAddress(address) {
  return address === ANY_ADDRESS
}

export function getAnyAddress() {
  return ANY_ADDRESS
}
