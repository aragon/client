import { useEffect, useCallback } from 'react'

const aboutAragon = '5c98a9330428633d2cf3fd23'

const sectionToSuggestions = new Map([
  [
    'home',
    [
      '5cce35302c7d3a177d6e5b78', // home
      '5cce3c4c2c7d3a177d6e5ba2', // troubleshoot
      '5cce34a32c7d3a177d6e5b74', // about aragon apps
      '5cce259a2c7d3a177d6e5b33', // anatomy of association
      aboutAragon,
    ],
  ],
  [
    'settings',
    [
      '5cce3bd204286306738eb793', // settings
      aboutAragon,
    ],
  ],
  [
    'apps',
    [
      '5cce3baf04286306738eb792', // apps
      aboutAragon,
    ],
  ],
  [
    'permissions',
    [
      '5cce3a7104286306738eb788', // permissions
      aboutAragon,
    ],
  ],
  [
    'onboarding',
    [
      '5cce262f2c7d3a177d6e5b36', // prerequisites
      '5cce28e82c7d3a177d6e5b40', // about templates
      '5cce29a72c7d3a177d6e5b46', // create new democracy
      '5cce2f0f2c7d3a177d6e5b5a', // creeate multisig
      aboutAragon,
    ],
  ],
  [
    'finance',
    [
      '5cce39b32c7d3a177d6e5b8b', // finance
      aboutAragon,
    ],
  ],
  [
    'token manager',
    [
      '5cce38892c7d3a177d6e5b84', // token manager
      aboutAragon,
    ],
  ],
  [
    'voting',
    [
      '5cce393a2c7d3a177d6e5b87', // voting
      aboutAragon,
    ],
  ],
])

function useBeaconSuggestions({
  apps,
  beaconReady,
  locator: { instanceId, path },
  optedIn,
}) {
  const getSection = useCallback(() => {
    if (path === '/') {
      return 'onboarding'
    }
    const systemApp = Array.from(sectionToSuggestions.keys()).find(
      k => k === instanceId
    )
    if (systemApp) {
      return systemApp
    }
    const app = apps.find(({ proxyAddress }) => proxyAddress === instanceId)
    if (app) {
      return app.name.toLowerCase()
    }
    return null
  }, [path, instanceId, apps])

  useEffect(() => {
    if (optedIn && beaconReady) {
      const section = getSection()
      if (sectionToSuggestions.has(section)) {
        window.Beacon('suggest', sectionToSuggestions.get(section))
        return
      }
      // reset/suggest all
      window.Beacon('suggest', [])
    }
  }, [getSection, beaconReady, optedIn])
}

export default useBeaconSuggestions
