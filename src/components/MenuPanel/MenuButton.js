import React from 'react'
import { ButtonIcon, IconMenu } from '@aragon/ui'

export default props => (
  <ButtonIcon
    {...props}
    css={`
      width: auto;
      height: 100%;
      padding: 0 16px;
      margin-left: -30px;
    `}
  >
    <IconMenu />
  </ButtonIcon>
)
