import React from 'react'
import { Badge } from '@aragon/ui'

const NavigationItem = ({ title, badge }) => (
  <span>
    <span style={{ marginRight: '20px' }}>{title}</span>
    {badge && <Badge.App title={badge.title}>{badge.label}</Badge.App>}
  </span>
)

export default NavigationItem
