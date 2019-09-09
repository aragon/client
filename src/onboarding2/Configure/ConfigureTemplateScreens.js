import React, { useState, useEffect } from 'react'
import { GU, springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring'

const AnimatedDiv = animated.div

function ConfigureTemplateScreens({
  TemplateScreen,
  onNext,
  onPrev,
  screenIndex,
  screens,
  templateData,
}) {
  const [prevIndex, setPrevIndex] = useState(-1)

  useEffect(() => {
    setPrevIndex(screenIndex)
  }, [screenIndex])

  const direction = screenIndex > prevIndex ? 1 : -1

  return (
    <Transition
      native
      reset
      unique
      items={{ screenIndex, Screen: TemplateScreen }}
      keys={({ screenIndex }) => screenIndex}
      from={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${10 * direction}%, 0, 0)`,
      }}
      enter={{
        opacity: 1,
        position: 'static',
        transform: `translate3d(0%, 0, 0)`,
      }}
      leave={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${-10 * direction}%, 0, 0)`,
      }}
      config={springs.smooth}
    >
      {({ screenIndex, Screen }) => ({ opacity, transform, position }) => (
        <AnimatedDiv
          style={{ opacity, transform, position }}
          css={`
            display: grid;
            align-items: center;
            justify-content: center;
            top: 0;
            left: 0;
            right: 0;
          `}
        >
          <div
            css={`
              max-width: ${82 * GU}px;
              padding: 0 ${3 * GU}px ${3 * GU}px;
            `}
          >
            <Screen
              data={templateData}
              fields={
                {
                  /* TODO: pass the fields from the template contract */
                }
              }
              next={onNext}
              back={onPrev}
              screens={screens}
              screenIndex={screenIndex}
            />
          </div>
        </AnimatedDiv>
      )}
    </Transition>
  )
}

export default ConfigureTemplateScreens
