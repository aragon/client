import React from 'react'
import styled from 'styled-components'
import { spring as springConf } from '@aragon/ui'
import { Motion, spring } from 'react-motion'

const BORDER_WIDTH = 4

const VALUE_DEFAULT = 1
const SIZE_DEFAULT = 80
const LABEL_DEFAULT = value => `${Math.round(value * 100)}%`

const CircleGraph = ({ value, label, size }) => {
  const length = Math.PI * 2 * size
  const radius = (size - BORDER_WIDTH) / 2
  return (
    <Motion
      defaultStyle={{ progressValue: 0 }}
      style={{ progressValue: spring(value, springConf('slow')) }}
    >
      {({ progressValue }) => (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <CircleBase cx={size / 2} cy={size / 2} r={radius} />
          <CircleValue
            cx={size / 2}
            cy={size / 2}
            r={radius}
            style={{
              strokeDasharray: length,
              strokeDashoffset: length - length * progressValue / 2,
              strokeWidth: BORDER_WIDTH,
            }}
          />
          <Label x="50%" y="50%">
            {label(Math.min(value, Math.max(0, progressValue)))}
          </Label>
        </svg>
      )}
    </Motion>
  )
}

CircleGraph.defaultProps = {
  value: VALUE_DEFAULT,
  size: SIZE_DEFAULT,
  label: LABEL_DEFAULT,
}

const CircleBase = styled.circle`
  fill: none;
  stroke: #6d777b;
  opacity: 0.3;
`

const CircleValue = styled.circle`
  fill: none;
  transform: rotate(270deg);
  transform-origin: 50% 50%;
  stroke: #21c1e7;
`

const Label = styled.text`
  fill: #000;
  font-size: 16px;
  font-weight: 600;
  dominant-baseline: middle;
  alignment-baseline: middle;
  text-anchor: middle;
`

export default CircleGraph
