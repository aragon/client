import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { CustomLabelModalContext } from '../../components/CustomLabelModal/CustomLabelModalManager'
import { IdentityContext } from '../../components/IdentityManager/IdentityManager'

const CustomLabelIdentityBadge = ({ address, ...props }) => {
  const { resolve } = React.useContext(IdentityContext)
  const { showCustomLabelModal } = React.useContext(CustomLabelModalContext)
  const [label, setLabel] = React.useState()
  const handleResolve = async () => {
    const { name = null } = await resolve(address)
    setLabel(name)
  }
  const handleClick = () => {
    showCustomLabelModal(address).then(handleResolve)
  }
  React.useEffect(() => {
    handleResolve()
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
