import React from 'react'
import { ButtonBase } from '@aragon/ui'

const ItemButton = props => (
  <ButtonBase
    css={`
      display: flex;
      align-items: center;
      height: 44px;
    `}
    {...props}
  />
)

export default ItemButton
