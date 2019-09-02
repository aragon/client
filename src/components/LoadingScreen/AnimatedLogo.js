import React from 'react'
import PropTypes from 'prop-types'
import { keyframes } from 'styled-components'
import { useTheme } from '@aragon/ui'

const PATH = `
  M75 19a161.38 161.38 0 0 0-7.37 2.68 214.8 214.8 0 0 0-14.98 6.5
  C38.81 34.8 25.92 42.74 15 52
  c.59 2.94 1.49 6.6 2.78 10.86
  a136.54 136.54 0 0 0 8.39 21.24
  c5.17 10.43 11.44 19.48 18.64 26.95
  A80.72 80.72 0 0 0 75 131
  a80.86 80.86 0 0 0 30.18-19.98
  c7.18-7.44 13.46-16.53 18.65-27
  a138.28 138.28 0 0 0 8.38-21.2
  c1.29-4.24 2.2-7.9 2.79-10.82-10.92-9.25-23.81-17.18-37.67-23.82
  a215.66 215.66 0 0 0-14.99-6.5
  A161.55 161.55 0 0 0 75 19z
`

const STROKE_WIDTH = 3
const LOOP_DURATION = 1800
const DONE_TRANSITION_DURATION = 400
const DASH_ARRAY = 348.5 // circumference, found by manually incrementing it :o
const GRADIENT_COLOR_START = '#2CF4E1'
const GRADIENT_COLOR_STOP = '#2CB2E1'
const ANIM_FUNCTION = 'cubic-bezier(0.7, 0, 0.3, 1)'
const GRADIENT_ID = 'loading-screen-logo-gradient'

const animGradient = keyframes`
  0% { stroke-dashoffset: ${DASH_ARRAY} }
  60%, 100% { stroke-dashoffset: 0 }
`

const animMask = keyframes`
  0%, 10% { stroke-dashoffset: ${DASH_ARRAY} }
  90%, 100% { stroke-dashoffset: 0 }
`

const AnimatedLogo = React.memo(function AnimatedLogo({ done }) {
  return (
    <svg width={150} height={150} fill="none">
      <Outline />
      <Outline
        gradient
        css={`
          stroke-dasharray: ${DASH_ARRAY};
          stroke-dashoffset: ${DASH_ARRAY};
          animation: ${LOOP_DURATION}ms ${ANIM_FUNCTION} infinite
            ${animGradient};
        `}
        style={{
          animationPlayState: done ? 'paused' : 'running',
        }}
      />
      <Outline
        css={`
          stroke-dasharray: ${DASH_ARRAY};
          stroke-dashoffset: ${DASH_ARRAY};
          animation: ${LOOP_DURATION}ms ${ANIM_FUNCTION} infinite ${animMask};
        `}
        style={{
          animationPlayState: done ? 'paused' : 'running',
        }}
      />
      <Outline
        gradient
        css={`
          transition: opacity ${DONE_TRANSITION_DURATION}ms ease-out;
        `}
        style={{ opacity: Number(done) }}
      />
      <defs>
        <linearGradient
          id={GRADIENT_ID}
          x1={6.898}
          y1={75.052}
          x2={143.077}
          y2={75.052}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor={GRADIENT_COLOR_START} />
          <stop offset={1} stopColor={GRADIENT_COLOR_STOP} />
        </linearGradient>
      </defs>
    </svg>
  )
})

AnimatedLogo.propTypes = {
  done: PropTypes.bool,
}

AnimatedLogo.defaultProps = {
  done: false,
}

const Outline = ({ gradient = false, ...props }) => {
  const theme = useTheme()
  return (
    <path
      d={PATH}
      stroke={gradient ? `url(#${GRADIENT_ID})` : theme.border}
      strokeWidth={STROKE_WIDTH}
      {...props}
    />
  )
}
Outline.propTypes = {
  gradient: PropTypes.bool,
}

export default AnimatedLogo
