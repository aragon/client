import React from 'react'
import { ButtonBase, GU, useTheme, textStyle } from '@aragon/ui'

function FavoritesMenuItemButton(props) {
  const theme = useTheme()
  return (
    <ButtonBase
      css={`
        display: flex;
        align-items: center;
        height: ${7 * GU}px;
        color: ${theme.surfaceContent};
        background: ${theme.surface};
        ${textStyle('body2')}
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
