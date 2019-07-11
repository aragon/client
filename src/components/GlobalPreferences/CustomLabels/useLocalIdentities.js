import { useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useIdentity } from '../../IdentityManager/IdentityManager'

const ASC = Symbol('asc')
const DESC = Symbol('desc')
const sortDesc = (a, b) => b.name.localeCompare(a.name)
const sortAsc = (a, b) => a.name.localeCompare(b.name)

function useLocalIdentities(wrapper) {
  const cancelled = useRef()
  const { identityEvents$ } = useIdentity()
  const [identities, setIdentities] = useState([])
  const [sort, setSort] = useState(ASC)

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
      .sort(sort === ASC ? sortAsc : sortDesc)
    if (!cancelled.current) {
      setIdentities(identities)
    }
  }, [wrapper, cancelled, sort])

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

  return {
    identities,
    sortIdentities: sort,
    handleToggleSort: () => setSort(sort === ASC ? DESC : ASC),
  }
}

export { ASC, DESC }
export default useLocalIdentities
