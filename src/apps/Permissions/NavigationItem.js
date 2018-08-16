import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import IdentityBadge from '../../components/IdentityBadge'

const NavigationItem = ({ title, badge, address }) => (
  <Main>
    <span style={{ marginRight: '20px' }}>{title}</span>
    {!badge && address && <IdentityBadge entity={address} />}
    {badge && <Badge.App title={badge.title}>{badge.label}</Badge.App>}
  </Main>
)

const Main = styled.span`
  display: flex;
  align-items: center;
`

export default NavigationItem
