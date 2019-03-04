import { getKnownApp } from './known-apps'
import defaultAppIcon from './assets/default-app-icon.svg'

const APP_DEFAULT = {
  name: 'Unknown',
  icons: { large: defaultAppIcon, small: defaultAppIcon },
  description: 'There is no description for this app.',
  longdesc: 'There is no description for this app.',
  screenshots: [],
  sourceUrl: null,
  version: 'unknown',
  versions: [],
}

// Get the informations related to an app, from an app instance.
export const getAppFromInstance = appInstance => {
  // Copy some fields from the app instance onto the app (if truthy).
  const app = ['name', 'version', 'appId', 'appName', 'versions'].reduce(
    (app, prop) =>
      appInstance[prop] ? { ...app, [prop]: appInstance[prop] } : app,
    { ...APP_DEFAULT }
  )

  app.instances = [appInstance.proxyAddress]
  app.canUpgrade =
    app.versions.findIndex(({ name }) => name === app.version) > 0

  const knownApp = getKnownApp(appInstance.appName)
  return knownApp ? { ...app, ...knownApp } : app
}

// Get apps (groupd by appId) from app instances
export const getAppsFromInstances = appInstances => {
  const apps = appInstances
    .filter(appInstance => !appInstance.isAragonOsInternalApp)
    .reduce((apps, appInstance) => {
      const { appId } = appInstance
      const app = apps.get(appId)

      if (!app) {
        return apps.set(appId, getAppFromInstance(appInstance))
      }

      return apps.set(appId, {
        ...app,
        instances: [...app.instances, appInstance.proxyAddress],
      })
    }, new Map())

  return [...apps.values()]
}
