import React from 'react'
import styled from 'styled-components'
import { springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring'

const SCREEN_SHIFT = 0.05

const Screen = ({ position, children, animate }) => (
  <Transition
    from={{ left: position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT, opacity: 0 }}
    enter={{ left: 0, opacity: 1 }}
    leave={{ left: position === 0 ? -SCREEN_SHIFT : SCREEN_SHIFT, opacity: 0 }}
    config={springs.lazy}
    immediate={!animate}
    native
  >
    {children &&
      (({ opacity, left }) => (
        <Main>
          <animated.div
            style={{
              opacity,
              transform: left.interpolate(
                t => `translate3d(${t * 100}%, 0, 0)`
              ),
            }}
          >
            {children}
          </animated.div>
        </Main>
      ))}
  </Transition>
)

const Main = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 30px;
`

export default Screen
