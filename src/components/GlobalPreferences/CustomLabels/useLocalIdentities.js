import { useState, useEffect, useCallback, useRef } from 'react'
import { useIdentity } from '../../IdentityManager/IdentityManager'

function useLocalIdentities(wrapper) {
  const cancelled = useRef()
  const { identityEvents$ } = useIdentity()
  const [identities, setIdentities] = useState([])

  const handleGetAll = useCallback(async () => {
    if (!wrapper) {
      return
    }
    const localIdentities = await wrapper.getLocalIdentities()
    const identities = Object.entries(localIdentities).map(
      ([address, identity]) => ({
        ...identity,
        address,
      })
    )
    if (!cancelled.current) {
      setIdentities(identities)
    }
  }, [wrapper, cancelled])

  useEffect(() => {
    cancelled.current = false
    // first fetch
    handleGetAll()
    // events: all events trigger get all
    const subscription = identityEvents$.subscribe(handleGetAll)
    return () => {
      cancelled.current = true
      subscription.unsubscribe()
    }
  }, [handleGetAll, identityEvents$])

  return { identities }
}

export default useLocalIdentities
