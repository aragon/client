import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { CustomLabelModalContext } from '../../components/CustomLabelModal/CustomLabelModalManager'
import { LocalIdentityContext } from '../../components/LocalIdentityManager/LocalIdentityManager'

const resolve = localIdentities => property => address =>
  (localIdentities[address] && localIdentities[address][property]) || false

const CustomLabelIdentityBadge = ({ address, ...props }) => {
  const { showCustomLabelModal } = React.useContext(CustomLabelModalContext)
  const { localIdentities } = React.useContext(LocalIdentityContext)
  const label = resolve(localIdentities)('name')(address)

  return (
    <IdentityBadge
      {...props}
      customLabel={label || ''}
      address={address}
      popoverAction={{
        label: `${label ? 'Edit' : 'Add'} custom label`,
        onClick: () => showCustomLabelModal(address),
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
