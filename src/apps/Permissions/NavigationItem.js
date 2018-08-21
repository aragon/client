import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import IdentityBadge from '../../components/IdentityBadge'

const NavigationItem = ({ title, badge, address, entity }) => {
  const isEntity = !badge && address
  return (
    <Main>
      <Title>{title}</Title>
      {isEntity && (
        <IdentityBadge
          entity={entity && entity.type === 'any' ? 'Any account' : address}
        />
      )}
      {badge && <Badge.App title={badge.title}>{badge.label}</Badge.App>}
    </Main>
  )
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

const Title = styled.span`
  margin-right: 20px;
`

export default NavigationItem
