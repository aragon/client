import React from 'react'
import { ButtonIcon, IconMenu } from '@aragon/ui'

export default props => (
  <ButtonIcon
    {...props}
    label="Menu"
    css={`
      width: auto;
      height: 100%;
      padding: 0 8px 0 16px;
      margin: 0 8px 0 -30px;
    `}
  >
    <IconMenu />
  </ButtonIcon>
)
