import React from 'react'
import { useIconSize } from './useIconSize'
import PropTypes from 'prop-types'

export default function IconPrompt({ size, ...props }) {
  const sizeValue = useIconSize(size)

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.07527 6.03339L4.07526 6.03339C3.77491 6.28991 3.77491 6.71707 4.07526 6.97358L8.55562 10.8001L4.07526 14.6265L4.07526 14.6265C3.77491 14.883 3.77491 15.3102 4.07526 15.5667C4.3616 15.8112 4.81749 15.8112 5.10383 15.5667L10.1346 11.2701C10.2812 11.145 10.3599 10.9752 10.3599 10.8001C10.3599 10.6249 10.2812 10.4551 10.1346 10.3299L5.10383 6.03339L5.10382 6.03339C4.81749 5.78887 4.3616 5.78887 4.07527 6.03339Z"
        fill="#8FA4B5"
        stroke="#8FA4B5"
        strokeWidth="0.3"
      />
      <path
        d="M20.4224 16.7769H11.8293C11.663 16.7769 11.5275 16.8729 11.4396 16.9978C11.3514 17.123 11.3017 17.2881 11.3017 17.4635C11.3017 17.6388 11.3514 17.8039 11.4396 17.9292C11.5275 18.054 11.663 18.15 11.8293 18.15H20.4224C20.5887 18.15 20.7242 18.054 20.8121 17.9292C20.9002 17.8039 20.95 17.6388 20.95 17.4635C20.95 17.2881 20.9002 17.123 20.8121 16.9978C20.7242 16.8729 20.5887 16.7769 20.4224 16.7769Z"
        fill="#8FA4B5"
        stroke="#8FA4B5"
        strokeWidth="0.3"
      />
    </svg>
  )
}

IconPrompt.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny']),
}
