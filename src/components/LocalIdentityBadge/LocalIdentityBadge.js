import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import { IdentityContext } from '../IdentityManager/IdentityManager'
import { EventEmitterContext } from '../EventEmitterManager/EventEmitterManager'

const LocalIdentityBadge = ({ address, ...props }) => {
  const { resolve } = React.useContext(IdentityContext)
  const { showLocalIdentityModal } = React.useContext(LocalIdentityModalContext)
  const { eventEmitter } = React.useContext(EventEmitterContext)
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
    if (updatedAddress === address) {
      handleResolve()
    }
  }
  React.useEffect(() => {
    handleResolve()
    eventEmitter.on('modifyLocalIdentity', handleEvent)
    return () => eventEmitter.off('modifyLocalIdentity', handleEvent)
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
