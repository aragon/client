import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring'

const SCREEN_SHIFT = 0.05

const Main = ({ children, opacity, left, active }) => (
  <animated.div
    style={{
      zIndex: active ? '2' : '1',
      opacity,
      transform: left.interpolate(t => `translate3d(${t * 100}%, 0, 0)`),
    }}
  >
    {children}
  </animated.div>
)

Main.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  left: PropTypes.object.isRequired,
  opacity: PropTypes.object.isRequired,
}

const Screen = ({ position, children, animate }) => (
  <Transition
    from={{ left: position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT, opacity: 0 }}
    enter={{ left: 0, opacity: 1 }}
    leave={{ left: position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT, opacity: 0 }}
    config={springs.lazy}
    immediate={!animate}
    active={Boolean(children)}
    native
  >
    {children && (props => <StyledMain {...props} children={children} />)}
  </Transition>
)

Screen.propTypes = {
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.number.isRequired,
}

const StyledMain = styled(Main)`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 30px;
`

export default Screen
