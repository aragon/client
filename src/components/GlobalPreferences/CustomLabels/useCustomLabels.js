import { useContext, useState, useEffect, useCallback } from 'react'
import {
  IdentityContext,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'

function useCustomLabels(wrapper) {
  const { identityEvents$ } = useContext(IdentityContext)
  const [localIdentities, setLocalIdentities] = useState({})

  const handleGetAll = useCallback(async () => {
    if (!wrapper) {
      return
    }
    setLocalIdentities(await wrapper.getLocalIdentities())
  }, [wrapper])
  const handleClearAll = useCallback(async () => {
    if (!wrapper) {
      return
    }
    await wrapper.clearLocalIdentities()
    setLocalIdentities({})
    identityEvents$.next({ type: identityEventTypes.CLEAR })
  }, [wrapper, identityEvents$])
  const handleModify = useCallback(
    (address, data) => {
      if (!wrapper) {
        return
      }
      wrapper.modifyAddressIdentity(address, data)
    },
    [wrapper]
  )
  const handleImport = useCallback(
    async list => {
      if (!wrapper) {
        return
      }
      if (!list) {
        return
      }
      setLocalIdentities({})
      for (const { name, address } of list) {
        await wrapper.modifyAddressIdentity(address, { name })
      }
      setLocalIdentities(await wrapper.getLocalIdentities())
      identityEvents$.next({ type: identityEventTypes.IMPORT })
    },
    [wrapper, identityEvents$]
  )

  useEffect(() => {
    handleGetAll()
  }, [handleGetAll])

  return { localIdentities, handleImport, handleClearAll, handleModify }
}

export default useCustomLabels
