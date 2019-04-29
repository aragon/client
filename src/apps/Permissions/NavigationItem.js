import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, useViewport } from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { EthereumAddressType } from '../../prop-types'

const NavigationItem = ({ title, badge, address, entity }) => {
  const isEntity = !badge && address
  const { above } = useViewport()

  return (
    <Main>
      <Title>{title}</Title>
      {above('medium') && isEntity && (
        <LocalIdentityBadge
          entity={entity && entity.type === 'any' ? 'Any account' : address}
        />
      )}
      {badge && <Badge.App title={badge.title}>{badge.label}</Badge.App>}
    </Main>
  )
}

NavigationItem.propTypes = {
  address: EthereumAddressType,
  badge: PropTypes.object,
  entity: PropTypes.object,
  title: PropTypes.string.isRequired,
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

const Title = styled.span`
  margin-right: 20px;
`

export default NavigationItem
