import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { CustomLabelModalContext } from '../../components/CustomLabelModal/CustomLabelModalManager'
import { LocalIdentityContext } from '../../components/LocalIdentityManager/LocalIdentityManager'

const resolve = localIdentities => address => localIdentities[address] || false

const CustomLabelIdentityBadge = ({ address, ...props }) => {
  const { showCustomLabelModal } = React.useContext(CustomLabelModalContext)
  const { localIdentities } = React.useContext(LocalIdentityContext)
  const resolveAddress = resolve(localIdentities)

  return (
    <IdentityBadge
      {...props}
      customLabel={resolveAddress(address) || ''}
      address={address}
      popoverAction={{
        label: `${resolveAddress(address) ? 'Edit' : 'Add'} custom label`,
        onClick: () => showCustomLabelModal(address),
        title: resolveAddress(address) ? (
          <Wrap>
            <Address>{resolveAddress(address)}</Address>
            <StyledBadge>Custom label</StyledBadge>
          </Wrap>
        ) : (
          'Address'
        ),
      }}
    />
  )
}

CustomLabelIdentityBadge.propTypes = {
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

export default CustomLabelIdentityBadge
