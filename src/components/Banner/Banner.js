import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'

export const BANNER_HEIGHT = 38

function Banner({ text, textColor, button, color }) {
  return (
    <div
      color={color}
      css={`
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        height: ${BANNER_HEIGHT}px;
        padding: ${0.5 * GU}px ${1 * GU}px;
        background-color: ${({ color }) => color};
      `}
    >
      <div
        css={`
          white-space: nowrap;
          color: ${textColor};
        `}
      >
        {text}
      </div>
      <div
        css={`
          display: flex;
          justify-content: center;
          margin-left: ${1 * GU}px;
        `}
      >
        {button}
      </div>
    </div>
  )
}

Banner.propTypes = {
  button: PropTypes.node,
  color: PropTypes.string,
  text: PropTypes.node,
  textColor: PropTypes.string,
}

export default Banner
