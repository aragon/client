import { useEffect, useCallback, useState } from 'react'
import suggestions from './suggestions'
import { staticApps } from '../../static-apps'

const sectionToSuggestions = new Map(suggestions)

function useBeaconSuggestions({
  apps,
  beaconReady,
  locator: { instanceId, path },
  optedIn,
}) {
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
      return app.appId
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
    if (!optedIn || !beaconReady) {
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
  }, [optedIn, beaconReady, originalOptedIn])
}

export default useBeaconSuggestions
