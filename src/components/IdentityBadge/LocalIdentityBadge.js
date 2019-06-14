import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import { isAddress } from '../../web3-utils'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'
import IdentityBadgeWithNetwork from './IdentityBadgeWithNetwork'
import LocalIdentityPopoverTitle from './LocalIdentityPopoverTitle'

const LocalIdentityBadge = ({ entity, ...props }) => {
  const address = isAddress(entity) ? entity : null

  const { resolve, identityEvents$ } = React.useContext(IdentityContext)
  const { showLocalIdentityModal } = React.useContext(LocalIdentityModalContext)
  const [label, setLabel] = React.useState(null)
  const handleResolve = useCallback(async () => {
    try {
      const { name = null } = await resolve(address)
      setLabel(name)
    } catch (e) {
      // address does not resolve to identity
    }
  }, [address, resolve])

  const handleClick = useCallback(() => {
    showLocalIdentityModal(address)
      .then(handleResolve)
      .then(() =>
        identityEvents$.next({ type: identityEventTypes.MODIFY, address })
      )
      .catch(e => {
        /* user cancelled modify intent */
      })
  }, [address, identityEvents$, handleResolve, showLocalIdentityModal])

  const handleEvent = useCallback(
    updatedAddress => {
      if (updatedAddress.toLowerCase() === address.toLowerCase()) {
        handleResolve()
      }
    },
    [address, handleResolve]
  )
  const handleRemove = useCallback(
    async addresses => {
      const exists = addresses.find(
        addr => addr.toLowerCase() === address.toLowerCase()
      )
      if (exists) {
        setLabel(null)
      }
    },
    [address]
  )

  const clearLabel = useCallback(() => {
    setLabel(null)
  }, [])

  useEffect(() => {
    handleResolve()
    const subscription = identityEvents$.subscribe(event => {
      switch (event.type) {
        case identityEventTypes.MODIFY:
          return handleEvent(event.address)
        case identityEventTypes.CLEAR:
          return clearLabel()
        case identityEventTypes.IMPORT:
          return handleResolve()
        case identityEventTypes.REMOVE:
          return handleRemove(event.addresses)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [
    clearLabel,
    entity,
    handleEvent,
    handleResolve,
    handleRemove,
    identityEvents$,
  ])

  if (address === null) {
    return <IdentityBadgeWithNetwork {...props} customLabel={entity} />
  }

  return (
    <IdentityBadgeWithNetwork
      {...props}
      customLabel={label || ''}
      entity={address}
      popoverAction={{
        label: `${label ? 'Edit' : 'Add'} custom label`,
        onClick: handleClick,
      }}
      popoverTitle={
        label ? <LocalIdentityPopoverTitle label={label} /> : 'Address'
      }
    />
  )
}

LocalIdentityBadge.propTypes = {
  entity: PropTypes.string,
}

export default LocalIdentityBadge
