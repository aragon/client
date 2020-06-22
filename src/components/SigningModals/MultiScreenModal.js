import React, { useCallback, useState } from 'react'
import { Spring, Transition, animated } from 'react-spring'
import PropTypes from 'prop-types'
import {
  GU,
  Modal,
  Viewport,
  springs,
  textStyle,
  useViewport,
} from '@aragon/ui'
import { useSteps } from '../../hooks'

const AnimatedDiv = animated.div

function MultiScreenModal({ visible, screens, onClose }) {
  const steps = screens.length
  const { prev, step, next, direction } = useSteps(steps)
  const [measuredHeight, setMeasuredHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [firstStart, setFirstStart] = useState(true)
  const { below } = useViewport()

  const smallMode = below('medium')
  const { canClose = true, width = 680 } = screens[step]

  const renderScreen = useCallback(
    step => {
      const currentScreen = screens[step]
      const { title } = currentScreen

      return (
        <React.Fragment>
          <h1
            css={`
              ${smallMode ? textStyle('title4') : textStyle('title3')};

              line-height: 1.2;
              margin-bottom: ${3 * GU}px;
            `}
          >
            {title}
          </h1>
          {currentScreen.content({
            prevScreen: prev,
            nextScreen: next,
            closeModal: onClose,
          })}
        </React.Fragment>
      )
    },
    [prev, next, onClose, screens, smallMode]
  )

  const onStart = useCallback(() => {
    // Don’t animate or set the static height when the modal first opens
    if (firstStart) {
      setFirstStart(false)

      return
    }

    setMeasuredHeight(true)
  }, [firstStart])

  const handleModalClose = useCallback(() => {
    if (canClose) {
      onClose()
    }
  }, [canClose, onClose])

  return (
    <Viewport>
      {({ width: viewportWidth }) => {
        const gutter = 30
        const containWidth = viewportWidth < width + gutter

        return (
          <Modal
            padding={0}
            width={containWidth ? viewportWidth - gutter : width}
            onClose={handleModalClose}
            visible={visible}
            closeButton={canClose}
          >
            <div
              css={`
                padding: ${smallMode ? 3 * GU : 5 * GU}px;
              `}
            >
              <Spring
                config={springs.smooth}
                to={{ height }}
                immediate={firstStart}
                native
              >
                {({ height }) => (
                  <AnimatedDiv
                    style={{
                      position: 'relative',
                      height: measuredHeight ? height : 'auto',
                    }}
                  >
                    <Transition
                      config={springs.smooth}
                      items={step}
                      immediate={firstStart}
                      from={{
                        opacity: 0,
                        transform: `translate3d(${20 *
                          GU *
                          direction}px, 0, 0)`,
                      }}
                      enter={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                      leave={{
                        opacity: 0,
                        transform: `translate3d(${20 *
                          GU *
                          -direction}px, 0, 0)`,
                      }}
                      onRest={(_, status) => {
                        if (status === 'update') {
                          setMeasuredHeight(false)
                        }
                      }}
                      onStart={onStart}
                      native
                    >
                      {currentStep => ({ opacity, transform }) => (
                        <AnimatedDiv
                          ref={elt => {
                            if (elt) {
                              setHeight(elt.clientHeight)
                            }
                          }}
                          style={{
                            position:
                              currentStep === step ? 'static' : 'absolute',
                            transform: transform,
                            opacity: opacity,
                          }}
                        >
                          {renderScreen(currentStep)}
                        </AnimatedDiv>
                      )}
                    </Transition>
                  </AnimatedDiv>
                )}
              </Spring>
            </div>
          </Modal>
        )
      }}
    </Viewport>
  )
}

MultiScreenModal.propTypes = {
  visible: PropTypes.bool,
  screens: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.func,
      canClose: PropTypes.bool,
      width: PropTypes.number,
    })
  ),
  onClose: PropTypes.func,
}

export default MultiScreenModal
