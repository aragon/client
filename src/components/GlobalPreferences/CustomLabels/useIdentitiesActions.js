import { useCallback, useMemo, useState } from 'react'
import { saveAs } from 'file-saver'
import {
  identityEventTypes,
  useIdentity,
} from '../../IdentityManager/IdentityManager'
import { dateFormat } from '../../../util/date'
import { log } from '../../../util/utils'
import { useRouting } from '../../../routing'
import { utoa } from '../../../util/string'

function useIdentitiesActions({
  filteredIdentities,
  identitiesSelected,
  someSelected,
  wrapper,
}) {
  const { identityEvents$ } = useIdentity()

  // share
  const [shareModalOpened, setShareModalOpened] = useState(false)

  const routing = useRouting()
  const { orgAddress } = routing.mode

  const shareLink = useMemo(() => {
    const identitiesToShare = filteredIdentities.filter(({ address }) =>
      identitiesSelected.get(address)
    )
    try {
      const labels = utoa(JSON.stringify(identitiesToShare))
      // Embed the organization address as saving labels (on the receipient's side) requires an
      // wrapper context (that is only created on an organization path)
      return `${window.location.origin}/#${orgAddress}${routing.path({
        preferences: { section: 'custom-labels', data: { labels } },
      })}`
    } catch (err) {
      log('Error while creating the identities sharing link:', err)
      return ''
    }
  }, [filteredIdentities, identitiesSelected, orgAddress, routing])

  // import
  const handleImport = useCallback(
    async list => {
      if (!wrapper) {
        return
      }
      await Promise.all(
        list.map(({ name, address }) =>
          wrapper.modifyAddressIdentity(address, { name })
        )
      )
      identityEvents$.next({ type: identityEventTypes.IMPORT })
    },
    [wrapper, identityEvents$]
  )

  // export
  const handleExport = useCallback(() => {
    if (!someSelected) {
      return
    }
    // standard: https://en.wikipedia.org/wiki/ISO_8601
    const today = dateFormat(Date.now(), 'onlyDate')
    const blob = new Blob(
      [
        JSON.stringify(
          filteredIdentities.filter(({ address }) =>
            identitiesSelected.get(address)
          )
        ),
      ],
      { type: 'text/json' }
    )
    saveAs(blob, `aragon-labels_${orgAddress}_${today}.json`)
  }, [someSelected, filteredIdentities, identitiesSelected, orgAddress])

  // remove
  const [removeModalOpened, setRemoveModalOpened] = useState(false)
  const handleRemove = useCallback(async () => {
    if (!wrapper) {
      return
    }
    const toRemove = filteredIdentities
      .filter(({ address }) => identitiesSelected.get(address))
      .map(({ address }) => address)
    await wrapper.removeLocalIdentities(toRemove)
    setRemoveModalOpened(false)
    identityEvents$.next({
      type: identityEventTypes.REMOVE,
      addresses: toRemove,
    })
  }, [filteredIdentities, identitiesSelected, identityEvents$, wrapper])

  return {
    // share
    handleShareModalOpen: useCallback(() => {
      if (someSelected) {
        setShareModalOpened(true)
      }
    }, [someSelected]),
    handleShareModalClose: useCallback(() => setShareModalOpened(false), []),
    shareModalOpened,
    shareLink,
    // import
    handleImport,
    // export
    handleExport,
    // remove
    handleRemove,
    handleRemoveModalClose: () => setRemoveModalOpened(false),
    handleRemoveModalOpen: useCallback(() => {
      if (someSelected) {
        setRemoveModalOpened(true)
      }
    }, [someSelected]),
    removeModalOpened,
  }
}

export default useIdentitiesActions
