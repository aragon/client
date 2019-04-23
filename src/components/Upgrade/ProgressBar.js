import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring/hooks'
import { springs } from '@aragon/ui'

const ProgressBar = ({ value }) => {
  const transitionStyles = useSpring({
    config: springs.lazy,
    to: { transform: `scale3d(${value}, 1, 1)` },
  })
  return <Bar style={transitionStyles} />
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
}

const Bar = styled(animated.div)`
  position: absolute;
  top: 0;
  z-index: 2;
  // prevents engines rounding issues
  left: -1px;
  right: -1px;
  height: 8px;
  background: linear-gradient(90deg, #00dbe2, #01bfe3);
  transform-origin: 0 0;
`

export default ProgressBar
