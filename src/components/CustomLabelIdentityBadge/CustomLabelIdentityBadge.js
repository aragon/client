import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { CustomLabelModalConsumer } from '../../components/CustomLabelModal/CustomLabelModalManager'
import { resolve } from '../../mockCustomLabelsManager'

const CustomLabelIdentityBadge = ({ address, ...props }) => (
  <CustomLabelModalConsumer>
    {({ showCustomLabelModal }) => (
      <IdentityBadge
        {...props}
        customLabel={resolve(address) || ''}
        address={address}
        popoverAction={{
          label: `${resolve(address) ? 'Edit' : 'Add'} custom label`,
          onClick: () => showCustomLabelModal(address),
          title: resolve(address) ? (
            <Wrap>
              <Address>{resolve(address)}</Address>
              <StyledBadge>Custom label</StyledBadge>
            </Wrap>
          ) : (
            'Address'
          ),
        }}
      />
    )}
  </CustomLabelModalConsumer>
)

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
