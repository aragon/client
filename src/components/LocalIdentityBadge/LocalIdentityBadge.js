import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'

const LocalIdentityBadge = ({ address, ...props }) => {
  const { resolve, identityEvents$ } = React.useContext(IdentityContext)
  const { showLocalIdentityModal } = React.useContext(LocalIdentityModalContext)
  const [label, setLabel] = React.useState()
  const handleResolve = async () => {
    try {
      const { name = null } = await resolve(address)
      setLabel(name)
    } catch (e) {
      // address does not ressolve to identity
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
  }, [])

  return (
    <IdentityBadge
      {...props}
      customLabel={label || ''}
      address={address}
      popoverAction={{
        label: `${label ? 'Edit' : 'Add'} custom label`,
        onClick: handleClick,
      }}
      popoverTitle={
        label ? (
          <Wrap>
            <Address>{label}</Address>
            <StyledBadge>Custom label</StyledBadge>
          </Wrap>
        ) : (
          'Address'
        )
      }
    />
  )
}

LocalIdentityBadge.propTypes = {
  address: PropTypes.string,
}

const Wrap = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  padding-right: 24px;
`

const Address = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledBadge = styled(Badge)`
  margin-left: 16px;
  text-transform: uppercase;
  ${font({ size: 'xxsmall' })};
`

export default LocalIdentityBadge
