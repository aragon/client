import { useEffect, useCallback } from 'react'
import suggestions from './suggestions.json'

const sectionToSuggestions = new Map(suggestions)

function useBeaconSuggestions({
  apps,
  beaconReady,
  locator: { instanceId, path },
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
    if (beaconReady) {
      const section = getSection()
      if (sectionToSuggestions.has(section)) {
        window.Beacon('suggest', sectionToSuggestions.get(section))
        return
      }
      // reset/suggest all
      window.Beacon('suggest', [])
    }
  }, [getSection, beaconReady])
}

export default useBeaconSuggestions
