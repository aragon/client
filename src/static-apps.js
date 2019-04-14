import React from 'react'
import { IconSettings, IconPermissions, IconApps } from '@aragon/ui'
import AppIcon from './components/AppIcon/AppIcon'

const homeApp = {
  appId: 'home',
  name: 'Home',
  instances: [{ instanceId: 'home' }],
}

export const staticApps = new Map(
  Object.entries({
    apps: {
      app: {
        appId: 'apps',
        name: 'App Center',
        icon: <IconApps />,
        instances: [{ instanceId: 'apps' }],
      },
      route: '/apps',
    },
    home: {
      app: {
        ...homeApp,
        icon: <AppIcon app={homeApp} />,
      },
      route: '/',
    },
    permissions: {
      app: {
        appId: 'permissions',
        name: 'Permissions',
        icon: <IconPermissions />,
        instances: [{ instanceId: 'permissions' }],
      },
      route: '/permissions',
    },
    settings: {
      app: {
        appId: 'settings',
        name: 'Settings',
        icon: <IconSettings />,
        instances: [{ instanceId: 'settings' }],
      },
      route: '/settings',
    },
  })
)
