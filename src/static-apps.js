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
    console: staticApp('console', 'Console'),
    home: staticApp('home', 'Home', ''),
    organization: staticApp('organization', 'Organization'),
    permissions: staticApp('permissions', 'Permissions'),
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
