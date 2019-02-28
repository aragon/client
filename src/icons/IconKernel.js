import React from 'react'
import PropTypes from 'prop-types'

const IconKernel = ({ size = 28, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h28v28H0z" />
      <rect
        stroke="currentColor"
        x="5.5"
        y="5.5"
        width="17"
        height="17"
        rx="2"
      />
      <path
        d="M8 23v2M12 23v2M16 23v2M20 23v2"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M8 3v2M12 3v2M16 3v2M20 3v2" />
      </g>
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M25 8h-2M25 12h-2M25 16h-2M25 20h-2" />
      </g>
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M5 8H3M5 12H3M5 16H3M5 20H3" />
      </g>
    </g>
  </svg>
)

IconKernel.propTypes = {
  size: PropTypes.number,
}

export default IconKernel
