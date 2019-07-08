import { useContext } from 'react'
import {
  IdentityContext,
  identityEventTypes,
} from '../../IdentityManager/IdentityManager'
import { LocalIdentityModalContext } from '../../LocalIdentityModal/LocalIdentityModalManager'

function useLocalIdentityModal() {
  const { identityEvents$ } = useContext(IdentityContext)
  const { showLocalIdentityModal } = useContext(LocalIdentityModalContext)
  const handleShowLocalIdentityModal = address => async () => {
    try {
      await showLocalIdentityModal(address)
      // emit event
      identityEvents$.next({ type: identityEventTypes.MODIFY, address })
    } catch (e) {
      /* nothing was updated */
    }
  }

  return { handleShowLocalIdentityModal }
}

export default useLocalIdentityModal
