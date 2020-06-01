import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@aragon/ui'

function SubtleLabel({ children }) {
  const theme = useTheme()

  return (
    <span
      css={`
        color: ${theme.surfaceContentSecondary};
      `}
    >
      {children}
    </span>
  )
}

SubtleLabel.propTypes = {
  children: PropTypes.node,
}

export default SubtleLabel
