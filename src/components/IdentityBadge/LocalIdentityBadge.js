import React from 'react'
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
  if (address === null) {
    return <IdentityBadgeWithNetwork {...props} customLabel={entity} />
  }

  const { resolve, identityEvents$ } = React.useContext(IdentityContext)
  const { showLocalIdentityModal } = React.useContext(LocalIdentityModalContext)
  const [label, setLabel] = React.useState(null)
  const handleResolve = async () => {
    try {
      const { name = null } = await resolve(address)
      setLabel(name)
    } catch (e) {
      // address does not resolve to identity
    }
  }
  const handleClick = () => {
    showLocalIdentityModal(address)
      .then(handleResolve)
      .catch(e => {
        /* user cancelled modify intent */
      })
  }
  const handleEvent = updatedAddress => {
    if (updatedAddress.toLowerCase() === address.toLowerCase()) {
      handleResolve()
    }
  }
  const clearLabel = () => {
    setLabel(null)
  }
  React.useEffect(() => {
    handleResolve()
    const subscription = identityEvents$.subscribe(event => {
      switch (event.type) {
        case identityEventTypes.MODIFY:
          return handleEvent(event.address)
        case identityEventTypes.CLEAR:
          return clearLabel()
        case identityEventTypes.IMPORT:
          return handleResolve()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [entity, identityEvents$])

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
