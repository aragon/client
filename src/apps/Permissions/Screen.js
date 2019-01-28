import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { breakpoint } from '@aragon/ui'
import springs from '../../springs'

const SCREEN_SHIFT = 0.05

const Screen = ({ position, children, animate }) => (
  <Transition
    items={children}
    from={{
      left: (position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT) * 100,
      opacity: 0,
    }}
    enter={{ left: 0, opacity: 1 }}
    leave={{
      left: (position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT) * 100,
      opacity: 0,
    }}
    config={springs.smooth}
    immediate={!animate}
    native
  >
    {children => children && (props => <Main {...props} children={children} />)}
  </Transition>
)

Screen.propTypes = {
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.number.isRequired,
}

const Main = ({ children, opacity, left }) => (
  <StyledMain
    style={{
      opacity,
      transform: left.interpolate(t => `translate3d(${t}%, 0, 0)`),
    }}
  >
    {children}
  </StyledMain>
)

Main.propTypes = {
  children: PropTypes.node.isRequired,
  left: PropTypes.object.isRequired,
  opacity: PropTypes.object.isRequired,
}

const StyledMain = styled(animated.div)`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  ${breakpoint(
    'medium',
    `
      padding: 30px;
    `
  )}
`

export default Screen
