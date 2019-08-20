import React from 'react'
import { ButtonBase, useTheme } from '@aragon/ui'

function FavoritesMenuItemButton(props) {
  const theme = useTheme()
  return (
    <ButtonBase
      css={`
        display: flex;
        align-items: center;
        height: 100%;
        color: ${theme.surfaceContent};
        background: ${theme.surface};
        border-radius: 0;
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
      {...props}
    />
  )
}

export default FavoritesMenuItemButton
