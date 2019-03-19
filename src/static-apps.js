import React from 'react'
import { IconSettings, IconPermissions, IconApps } from '@aragon/ui'
import IconHomeSvg from './icons/app-home.svg'

const IconHome = () => (
  <img
    src={IconHomeSvg}
    alt=""
    css={`
      display: block;
      width: 22px;
      height: 22px;
    `}
  />
)

export const staticApps = new Map(
  Object.entries({
    apps: {
      app: {
        appId: 'apps',
        name: 'Apps',
        icon: <IconApps />,
        instances: [{ instanceId: 'apps' }],
      },
      route: '/apps',
    },
    home: {
      app: {
        appId: 'home',
        name: 'Home',
        icon: <IconHome />,
        instances: [{ instanceId: 'home' }],
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
