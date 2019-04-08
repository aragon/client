import React from 'react'
import { ButtonBase, theme } from '@aragon/ui'

const ItemButton = props => (
  <ButtonBase
    css={`
      display: flex;
      align-items: center;
      height: 44px;
      color: ${theme.textPrimary};
      border-radius: 0;
      &:active {
        background: rgba(220, 234, 239, 0.3);
      }
    `}
    {...props}
  />
)

export default ItemButton
