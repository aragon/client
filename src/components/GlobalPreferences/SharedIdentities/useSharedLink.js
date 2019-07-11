import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import {
  useIdentity,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { useSelected } from '../../../hooks'
import { atou } from '../../../string-utils'

const QUERY_VAR = '&l='

function useSharedLink(wrapper, toast) {
  const { identityEvents$ } = useContext(IdentityContext)
  const [isSharedLink, setIsSharedLink] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sharedIdentities, setSharedIdentities] = useState([])
  const initialSelected = useMemo(
    () => new Map(sharedIdentities.map(({ address }) => [address, true])),
    [sharedIdentities]
  )
  const { selected, setSelected, someSelected, allSelected } = useSelected(
    initialSelected
  )

  const handleCleanHash = useCallback(() => {
    const { hash } = window.location
    const path = hash.substr(0, hash.indexOf(QUERY_VAR))
    window.location.hash = path
  }, [])
  const handleSharedIdentitiesSave = useCallback(async () => {
    if (!wrapper) {
      return
    }
    setIsSaving(true)
    const list = sharedIdentities.filter(({ address }) => selected.get(address))
    for (const { name, address } of list) {
      await wrapper.modifyAddressIdentity(address, { name })
    }
    identityEvents$.next({ type: identityEventTypes.IMPORT })
    toast('Custom labels added')
    handleCleanHash()
    setIsSharedLink(false)
    setIsSaving(false)
  }, [
    handleCleanHash,
    identityEvents$,
    selected,
    setIsSaving,
    setIsSharedLink,
    sharedIdentities,
    toast,
    wrapper,
  ])
  const handleSharedIdentitiesCancel = useCallback(() => {
    handleCleanHash()
    setIsSharedLink(false)
  }, [handleCleanHash, setIsSharedLink])
  const handleToggleAll = useCallback(() => {
    const newSelected = new Map(
      sharedIdentities.map(({ address }) => [
        address,
        !(allSelected || someSelected),
      ])
    )
    setSelected(newSelected)
  }, [sharedIdentities, setSelected, someSelected, allSelected])
  const handleToggleIdentity = useCallback(
    address => () =>
      setSelected(new Map([...selected, [address, !selected.get(address)]])),
    [selected, setSelected]
  )

  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected, setSelected])
  useEffect(() => {
    const index = window.location.hash.indexOf(QUERY_VAR)
    if (index > -1) {
      const raw = window.location.hash.substr(index + QUERY_VAR.length)
      try {
        const data = JSON.parse(window.decodeURI(atou(raw)))
        setSharedIdentities(
          data.map(({ address, name }) => ({ address, name }))
        )
        setIsSharedLink(true)
      } catch (e) {
        console.warn(
          'There was an error parsing/validating the shared data: ',
          e
        )
      }
    }
  }, [setIsSharedLink, setSharedIdentities])

  return {
    handleSharedIdentitiesCancel,
    handleSharedIdentitiesSave,
    isSavingSharedLink: isSaving,
    isSharedLink,
    sharedIdentities,
    sharedIdentitiesSelected: selected,
    sharedIdentitiesSomeSelected: someSelected,
    sharedIdentitiesAllSelected: allSelected,
    handleSharedIdentitiesToggleAll: handleToggleAll,
    handleSharedIdentitiesToggleIdentity: handleToggleIdentity,
  }
}

export default useSharedLink
