import { useContext, useState, useEffect, useCallback } from 'react'
import { IdentityContext } from '../../IdentityManager/IdentityManager'

function useLocalIdentities(wrapper) {
  let cancelled = false
  const { identityEvents$ } = useContext(IdentityContext)
  const [identities, setIdentities] = useState([])

  const handleGetAll = useCallback(async () => {
    if (!wrapper) {
      return
    }
    const localIdentities = await wrapper.getLocalIdentities()
    const identities = Object.entries(localIdentities)
      .map(([address, identity]) => ({
        ...identity,
        address,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    if (!cancelled) {
      setIdentities(identities)
    }
  }, [wrapper, cancelled])

  useEffect(() => {
    cancelled = false
    // first fetch
    handleGetAll()
    // events: all events trigger get all
    const subscription = identityEvents$.subscribe(handleGetAll)
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [handleGetAll, identityEvents$])

  return { identities }
}

export default useLocalIdentities
