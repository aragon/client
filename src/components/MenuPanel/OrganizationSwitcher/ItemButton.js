import React from 'react'
import { theme } from '@aragon/ui'
import FocusVisible from '../../FocusVisible'

const ItemButton = props => (
  <FocusVisible>
    {({ focusVisible, onFocus }) => (
      <button
        onFocus={onFocus}
        css={`
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 44px;
          padding: 0;
          white-space: nowrap;
          cursor: pointer;
          border: 0;
          background: transparent;
          &:active {
            background: rgba(220, 234, 239, 0.3);
          }
          &:focus {
            outline: ${focusVisible ? `2px solid ${theme.accent}` : '0'};
          }
          &::-moz-focus-inner {
            border: 0;
          }
        `}
        {...props}
      />
    )}
  </FocusVisible>
)

export default ItemButton
