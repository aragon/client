import { useEffect, useCallback, useState } from 'react'
import { staticApps } from '../../static-apps'

const rawSuggestionsURL =
  'https://raw.githubusercontent.com/aragon/aragon/master/src/components/HelpScoutBeacon/suggestions.js'

let sectionToSuggestions = new Map()

function useBeaconSuggestions({
  apps,
  beaconReady,
  locator: { instanceId, path },
  optedIn,
}) {
  const [canSuggest, setCanSuggest] = useState(false)
  const [originalOptedIn] = useState(optedIn)
  const [shouldSuggest, setShouldSuggest] = useState(false)
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
    if (!shouldSuggest) {
      return
    }
    window.Beacon('suggest', sectionToSuggestions.get(getSection()))
  }, [getSection, shouldSuggest])

  useEffect(() => {
    if (!canSuggest || !beaconReady) {
      return
    }
    // this only happens when user opts in
    // when opting in beaconReady is set after the open event has been triggered
    // give it a minute before suggesting or a weird reace condition happens
    let timeout
    if (!originalOptedIn) {
      timeout = setTimeout(() => setShouldSuggest(true), 1000)
      return
    }
    setShouldSuggest(true)
    return () => clearTimeout(timeout)
  }, [canSuggest, beaconReady, originalOptedIn])

  useEffect(() => {
    if (optedIn) {
      const effect = async () => {
        try {
          const raw = await fetch(rawSuggestionsURL)
          const data = await raw.json()
          sectionToSuggestions = new Map(data)
          setCanSuggest(true)
        } catch (e) {
          console.warn(
            'There was an error fetching the suggestions to sections data'
          )
        }
      }
      effect()
    }
  }, [optedIn])
}

export default useBeaconSuggestions
