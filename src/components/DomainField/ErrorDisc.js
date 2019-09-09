import React from 'react'
import { useTheme, GU, IconCross } from '@aragon/ui'

function ErrorDisc() {
  const theme = useTheme()
  return (
    <div
      css={`
        width: ${3 * GU}px;
        height: ${3 * GU}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: ${theme.negative};
        color: ${theme.negativeContent};
      `}
    >
      <IconCross size="tiny" />
    </div>
  )
}

export default ErrorDisc
