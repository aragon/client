import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, useTheme, GU } from '@aragon/ui'

function DetailField({ title, children }) {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-bottom: ${3 * GU}px;
      `}
    >
      <h2
        css={`
            ${textStyle('label2')}
  
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${1 * GU}px;
          `}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

DetailField.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default DetailField
