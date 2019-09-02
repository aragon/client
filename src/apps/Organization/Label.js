import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, unselectable, useTheme } from '@aragon/ui'

const Label = ({ text, block, children }) => {
  const theme = useTheme()
  return (
    <label
      css={`
        ${textStyle('label2')};
        ${unselectable()};
        color: ${theme.surfaceContentSecondary};
        display: ${block ? 'block' : 'initial'};
      `}
    >
      {text}
      {children && children}
    </label>
  )
}

Label.defaultProps = {
  block: false,
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
  block: PropTypes.bool.isRequired,
  children: PropTypes.node,
}

export default Label
