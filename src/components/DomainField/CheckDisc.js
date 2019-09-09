import React from 'react'
import { useTheme, GU, IconCheck } from '@aragon/ui'

function CheckDisc() {
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
        background: ${theme.positive};
        color: ${theme.positiveContent};
      `}
    >
      <IconCheck size="tiny" />
    </div>
  )
}

export default CheckDisc
