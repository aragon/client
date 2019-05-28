import { useEffect, useCallback } from 'react'
import suggestions from './suggestions.json'
import { staticApps } from '../../static-apps'

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
    if (staticApps.has(instanceId)) {
      return instanceId
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
