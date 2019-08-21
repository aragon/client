import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  useIdentity,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { useSelected } from '../../../hooks'
import { atou } from '../../../string-utils'
import {
  getAppPath,
  GLOBAL_PREFERENCES_QUERY_PARAM,
  GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR,
} from '../../../routing'

const CUSTOM_LABELS_PATH = 'custom-labels'

function useSharedLink({ wrapper, toast, locator }) {
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

  const handleCleanHash = useCallback(() => {
    window.location.hash = `${getAppPath(
      locator
    )}${GLOBAL_PREFERENCES_QUERY_PARAM}${CUSTOM_LABELS_PATH}`
  }, [locator])
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
    handleCleanHash()
    setIsSharedLink(false)
    setIsSaving(false)
  }, [
    handleCleanHash,
    identityEvents$,
    selected,
    sharedIdentities,
    toast,
    wrapper,
  ])
  const handleSharedIdentitiesCancel = useCallback(() => {
    handleCleanHash()
    setIsSharedLink(false)
  }, [handleCleanHash])
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
    const {
      preferences: { params },
    } = locator
    if (!params.has(GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR)) {
      return
    }
    try {
      const data = JSON.parse(
        window.decodeURI(
          atou(params.get(GLOBAL_PREFERENCES_SHARE_LINK_QUERY_VAR))
        )
      )
      setSharedIdentities(data.map(({ address, name }) => ({ address, name })))
      setIsSharedLink(true)
    } catch (e) {
      console.warn('There was an error parsing/validating the shared data: ', e)
    }
  }, [locator])

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
