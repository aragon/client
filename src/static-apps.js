import React from 'react'
import AppIcon from './components/AppIcon/AppIcon'

function staticApp(id, name, route = `/${id}`) {
  const app = {
    name,
    appId: id,
    instances: [{ instanceId: id }],
  }

  app.icon = <AppIcon app={app} />

  return { app, route }
}

export const staticApps = new Map(
  Object.entries({
    apps: staticApp('apps', 'App Center'),
    home: staticApp('home', 'Home', ''),
    permissions: staticApp('permissions', 'Permissions'),
    settings: staticApp('settings', 'Settings'),
  })
)

export const isStaticApp = instanceId => {
  for (const { app } in staticApps) {
    if (app.appId === instanceId) {
      return true
    }
  }
  return false
}
