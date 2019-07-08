import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import {
  IdentityContext,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { utoa } from '../../../string-utils'

const mapToNameAndAddress = ({ address, name }) => ({ address, name })

function useIdentitiesActions({
  wrapper,
  filteredIdentities,
  identitiesSelected,
  dao,
  toast,
  someSelected,
}) {
  const { identityEvents$ } = useContext(IdentityContext)

  // share
  const [shareModalOpened, setShareModalOpened] = useState(false)
  const shareLink = useMemo(() => {
    //const base = `${window.location.origin}/#/${dao}`
    const base = window.location.href
    const identitiesToShare = filteredIdentities.reduce(
      (p, c) => [...p, ...(identitiesSelected.get(c.address) ? [c] : [])],
      []
    )
    try {
      const labels = utoa(JSON.stringify(identitiesToShare))
      return `${base}&l=${labels}`
    } catch (err) {
      console.log('Error while creating the identities sharing link:', err)
      return ''
    }
  }, [dao, filteredIdentities])

  // import
  const handleImport = async list => {
    if (!wrapper) {
      return
    }
    for (const { name, address } of list) {
      await wrapper.modifyAddressIdentity(address, { name })
    }
    identityEvents$.next({ type: identityEventTypes.IMPORT })
  }

  // export
  const handleExport = () => {
    if (!someSelected) {
      return
    }
    // standard: https://en.wikipedia.org/wiki/ISO_8601
    const today = format(Date.now(), 'yyyy-MM-dd')
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
  }

  // remove
  const [removeModalOpened, setRemoveModalOpened] = useState(false)
  const handleRemove = async () => {
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
  }

  return {
    // share
    handleShareModalOpen: () => {
      if (someSelected) {
        setShareModalOpened(true)
      }
    },
    handleShareModalClose: () => setShareModalOpened(false),
    shareModalOpened,
    shareLink,
    // import
    handleImport,
    // export
    handleExport,
    // remove
    handleRemove,
    handleRemoveModalClose: () => setRemoveModalOpened(false),
    handleRemoveModalOpen: () => {
      if (someSelected) {
        setRemoveModalOpened(true)
      }
    },
    removeModalOpened,
  }
}

export default useIdentitiesActions
