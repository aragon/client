import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GU, springs, useViewport } from '@aragon/ui'
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
  const { below } = useViewport()

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
      {({ screenIndex, Screen }) =>
        /* eslint-disable react/prop-types */
        ({ opacity, transform, position }) => (
          <AnimatedDiv
            style={{ opacity, transform, position }}
            css={`
              top: 0;
              left: 0;
              right: 0;
            `}
          >
            <div
              css={`
                margin: 0 auto;
                max-width: ${82 * GU}px;
                padding: 0 ${3 * GU}px ${(below('medium') ? 9 : 6) * GU}px
                  ${3 * GU}px;
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
        )
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

ConfigureTemplateScreens.propTypes = {
  TemplateScreen: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  screenIndex: PropTypes.number.isRequired,
  screens: PropTypes.array.isRequired,
  templateData: PropTypes.object.isRequired,
}

export default ConfigureTemplateScreens
