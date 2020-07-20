import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, useTheme } from '@aragon/ui'

function InfoField({ title, children }) {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-bottom: ${3.5 * GU}px;
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

InfoField.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default InfoField
