import React from 'react'
import PropTypes from 'prop-types'
import { useIconSize } from './utils'

export default function IconEnter({ size, ...props }) {
  const sizeValue = useIconSize(size)
  return (
    <svg
      width={sizeValue}
      height={sizeValue - 4}
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.9348 8.16083H1.83915C1.37572 8.16083 1 8.53654 1 8.99998C1 9.46346 1.37572 9.83914 1.83915 9.83914H20.9348C21.3983 9.83914 21.7739 9.46346 21.7739 8.99998C21.7739 8.53654 21.3983 8.16083 20.9348 8.16083Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.2"
      />
      <path
        d="M3.0263 9L9.59375 2.43251C9.92147 2.10479 9.92147 1.57347 9.59375 1.24576C9.26604 0.918081 8.73472 0.918081 8.407 1.24576L1.24615 8.4066C0.918437 8.73432 0.918437 9.26564 1.24615 9.59336L8.407 16.7542C8.57084 16.9181 8.78564 17 9.0004 17C9.21516 17 9.42995 16.9181 9.59379 16.7542C9.92151 16.4265 9.92151 15.8952 9.59379 15.5674L3.0263 9Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.2"
      />
      <path
        d="M21.1285 2.06421C20.6655 2.06421 20.2902 2.43663 20.2902 2.89599V9.05815C20.2902 9.51756 20.6655 9.88993 21.1285 9.88993C21.5915 9.88993 21.9669 9.51756 21.9669 9.05815V2.89603C21.967 2.43667 21.5916 2.06421 21.1285 2.06421Z"
        fill="currentColor"
      />
    </svg>
  )
}

IconEnter.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny']),
}
