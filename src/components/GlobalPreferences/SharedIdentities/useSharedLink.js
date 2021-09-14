import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  useIdentity,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { useSelected } from '../../../hooks'
import { useRouting } from '../../../routing'
import { atou } from '../../../util/string'

function useSharedLink({ wrapper, toast }) {
  const { identityEvents$ } = useIdentity()
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
  const routing = useRouting()

  const openScreenHome = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      preferences: { section: 'custom-labels' },
    }))
  }, [routing])

  const handleSharedIdentitiesSave = useCallback(async () => {
    if (!wrapper) {
      return
    }
    setIsSaving(true)
    const list = sharedIdentities.filter(({ address }) => selected.get(address))
    await Promise.all(
      list.map(({ name, address }) =>
        wrapper.modifyAddressIdentity(address, { name })
      )
    )
    identityEvents$.next({ type: identityEventTypes.IMPORT })
    toast('Custom labels added')
    openScreenHome()
    setIsSharedLink(false)
    setIsSaving(false)
  }, [
    openScreenHome,
    identityEvents$,
    selected,
    sharedIdentities,
    toast,
    wrapper,
  ])

  const handleSharedIdentitiesCancel = useCallback(() => {
    openScreenHome()
    setIsSharedLink(false)
  }, [openScreenHome])

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
    const { preferences } = routing

    if (!preferences.data.labels) {
      return
    }

    try {
      const data = JSON.parse(window.decodeURI(atou(preferences.data.labels)))
      setSharedIdentities(data.map(({ address, name }) => ({ address, name })))
      setIsSharedLink(true)
    } catch (e) {
      console.warn('There was an error parsing/validating the shared data: ', e)
    }
  }, [routing])

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
