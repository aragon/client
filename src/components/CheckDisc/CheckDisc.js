import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, GU, IconCross, IconCheck } from '@aragon/ui'

function CheckDisc({ mode, size }) {
  const theme = useTheme()
  const Icon = mode === 'error' ? IconCross : IconCheck
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${mode === 'error' ? theme.negative : theme.positive};
        color: ${mode === 'error'
          ? theme.negativeContent
          : theme.positiveContent};
      `}
    >
      <Icon width={size * 0.55} height={size * 0.55} />
    </div>
  )
}

CheckDisc.propTypes = {
  mode: PropTypes.oneOf(['success', 'error']),
  size: PropTypes.number,
}

CheckDisc.defaultProps = {
  mode: 'success',
  size: 3 * GU,
}

export default CheckDisc
