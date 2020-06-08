import { useState, useMemo, useCallback } from 'react'
import { saveAs } from 'file-saver'
import {
  useIdentity,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { utoa } from '../../../string-utils'
import { log } from '../../../utils'
import { getAppPath, getPreferencesSearch } from '../../../routing'
import { dateFormat } from '../../../date-utils'

const CUSTOM_LABELS_PATH = 'custom-labels'

function useIdentitiesActions({
  wrapper,
  filteredIdentities,
  identitiesSelected,
  locator,
  someSelected,
}) {
  const { dao } = locator
  const { identityEvents$ } = useIdentity()

  // share
  const [shareModalOpened, setShareModalOpened] = useState(false)

  const shareLink = useMemo(() => {
    const identitiesToShare = filteredIdentities.filter(({ address }) =>
      identitiesSelected.get(address)
    )

    try {
      const labels = utoa(JSON.stringify(identitiesToShare))
      const path = `${window.location.origin}/#${getAppPath({
        ...locator,
        search: getPreferencesSearch(CUSTOM_LABELS_PATH, { labels }),
      })}`
      return path
    } catch (err) {
      log('Error while creating the identities sharing link:', err)
      return ''
    }
  }, [filteredIdentities, identitiesSelected, locator])

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
    saveAs(blob, `aragon-labels_${dao}_${today}.json`)
  }, [someSelected, filteredIdentities, identitiesSelected, dao])

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
