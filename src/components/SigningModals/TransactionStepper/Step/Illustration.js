import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { STEP_ERROR, STEP_SUCCESS, STEP_WORKING } from '../stepper-statuses'

const gradients = {
  [STEP_WORKING]: [
    ['#98f9ff', '#00c2ff'],
    ['#01e8f7', '#00c2ff'],
  ],
  [STEP_SUCCESS]: [
    ['#9fe8d2', '#00c2ff'],
    ['#73d8ce', '#18b9a0'],
  ],
  [STEP_ERROR]: [
    ['#ffa48e', '#f8baab'],
    ['#fa8e75', '#ef7757'],
  ],
}

function Illustration({ status, index }) {
  const [backgroundFrom, backgroundTo] = gradients[status][0]
  const [foregroundFrom, foregroundTo] = gradients[status][1]

  // Inline SVGs don't scope their defs so we have to provide unique ids
  const gradientId = useCallback(id => `${status.description}-${index}-${id}`, [
    status,
    index,
  ])

  return (
    <svg
      viewBox="0 0 70 70"
      css={`
        display: block;
      `}
    >
      <defs>
        <linearGradient
          id={gradientId('a')}
          x1="86.03"
          y1="-2.54"
          x2="-184.81"
          y2="207.33"
          gradientTransform="matrix(1, 0, 0, -1, 0, 72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={backgroundFrom} />
          <stop offset="1" stopColor={backgroundTo} />
        </linearGradient>
        <linearGradient
          id={gradientId('b')}
          x1="59.34"
          y1="15.79"
          x2="38.41"
          y2="19.85"
          gradientTransform="matrix(1, 0, 0, -1, 0, 72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={foregroundFrom} />
          <stop offset="1" stopColor={foregroundTo} />
        </linearGradient>
        <linearGradient
          id={gradientId('c')}
          x1="54.24"
          y1="46.24"
          x2="16.48"
          y2="60.87"
          xlinkHref={`#${gradientId('b')}`}
        />
        <linearGradient
          id={gradientId('d')}
          x1="31.91"
          y1="21.06"
          x2="10.98"
          y2="25.11"
          xlinkHref={`#${gradientId('b')}`}
        />
      </defs>
      <path
        d="M64.18,48.77V21.23a5.48,5.48,0,0,0-2.72-4.73L37.72,2.73a5.45,5.45,0,0,0-5.44,0L8.54,16.5a5.48,5.48,0,0,0-2.72,4.73V48.77A5.48,5.48,0,0,0,8.54,53.5L32.28,67.27a5.45,5.45,0,0,0,5.44,0L61.46,53.5A5.48,5.48,0,0,0,64.18,48.77Z"
        fill={`url(#${gradientId('a')})`}
      />
      <path
        d="M61.46,53.5a5.48,5.48,0,0,0,2-2L35,35V68a5.39,5.39,0,0,0,2.72-.73Z"
        fill={`url(#${gradientId('b')})`}
        opacity="0.6"
      />
      <path
        d="M35,35,63.44,18.5a5.35,5.35,0,0,0-2-2L37.71,2.73a5.43,5.43,0,0,0-5.43,0L8.54,16.5a5.45,5.45,0,0,0-2,2Z"
        fill={`url(#${gradientId('c')})`}
      />
      <path
        d="M8.54,53.5a5.48,5.48,0,0,1-2-2L35,35V68a5.35,5.35,0,0,1-2.71-.73Z"
        opacity="0.4"
        fill={`url(#${gradientId('d')})`}
      />
    </svg>
  )
}

Illustration.propTypes = {
  status: PropTypes.oneOf([STEP_WORKING, STEP_SUCCESS, STEP_ERROR]),
  index: PropTypes.number,
}

export default Illustration
