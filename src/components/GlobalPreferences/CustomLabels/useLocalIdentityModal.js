import { useCallback, useContext } from 'react'
import {
  useIdentity,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { LocalIdentityModalContext } from '../../LocalIdentityModal/LocalIdentityModalManager'

function useLocalIdentityModal() {
  const { identityEvents$ } = useIdentity()
  const { showLocalIdentityModal } = useContext(LocalIdentityModalContext)
  const handleShowLocalIdentityModal = useCallback(
    address => async () => {
      try {
        await showLocalIdentityModal(address)
        // emit event
        identityEvents$.next({ type: identityEventTypes.MODIFY, address })
      } catch (e) {
        /* nothing was updated */
      }
    },
    [showLocalIdentityModal, identityEvents$]
  )

  return { handleShowLocalIdentityModal }
}

export default useLocalIdentityModal
