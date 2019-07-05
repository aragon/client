import { useContext, useState, useEffect, useCallback } from 'react'
import {
  IdentityContext,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'

function useLocalIdentities(wrapper) {
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
    setIdentities(identities)
  }, [wrapper])

  useEffect(() => {
    // first fetch
    handleGetAll()
    // events: all events trigger get all
    const subscription = identityEvents$.subscribe(handleGetAll)
    return () => subscription.unsubscribe()
  }, [handleGetAll])

  return { identities }
}

export default useLocalIdentities
