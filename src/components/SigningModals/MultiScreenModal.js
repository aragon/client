import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  noop,
  Viewport,
  springs,
  textStyle,
  useViewport,
  GU,
} from '@aragon/ui'
import { Spring, Transition, animated } from 'react-spring'
import { useSteps } from '../../hooks'

const AnimatedDiv = animated.div

const DEFAULT_MODAL_WIDTH = 85 * GU

function MultiScreenModal({ visible, screens, onClose }) {
  const steps = screens.length
  const { prev, step, next, direction } = useSteps(steps)
  const [applyStaticHeight, setApplyStaticHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [firstStart, setFirstStart] = useState(true)
  const { below } = useViewport()

  const smallMode = below('medium')

  // Store updates to screens in state
  // This prevents issues with step updates being older than screens
  const screensRef = useRef(screens)

  useEffect(() => {
    screensRef.current = screens
  }, [screens])

  const { disableClose, width } = screensRef.current[step]
  const modalWidth = width || DEFAULT_MODAL_WIDTH

  const renderScreen = useCallback(
    screen => {
      const { title, content } = screen

      return (
        <React.Fragment>
          <h1
            css={`
              ${smallMode ? textStyle('title4') : textStyle('title3')};

              margin-top: -${1 * GU}px;
              margin-bottom: ${2 * GU}px;
            `}
          >
            {title}
          </h1>
          {content({
            prevScreen: prev,
            nextScreen: next,
            closeModal: onClose,
          })}
        </React.Fragment>
      )
    },
    [prev, next, onClose, smallMode]
  )

  const onStart = useCallback(() => {
    // Don’t animate or set the static height when the modal first opens
    if (firstStart) {
      setFirstStart(false)

      return
    }

    setApplyStaticHeight(true)
  }, [firstStart])

  const handleModalClose = useCallback(() => {
    if (!disableClose) {
      onClose()
    }
  }, [disableClose, onClose])

  return (
    <Viewport>
      {({ width }) => {
        // Apply a small gutter when matching the viewport width
        const viewportWidth = width - 4 * GU

        return (
          <Modal
            padding={0}
            width={Math.min(viewportWidth, modalWidth)}
            onClose={handleModalClose}
            visible={visible}
            closeButton={!disableClose}
          >
            <Spring
              config={springs.swift}
              to={{ height }}
              immediate={firstStart}
              native
            >
              {({ height }) => (
                <AnimatedDiv
                  style={{
                    position: 'relative',
                    height: applyStaticHeight ? height : 'auto',
                  }}
                >
                  <Transition
                    config={(_, state) =>
                      state === 'leave' ? springs.instant : springs.smooth
                    }
                    items={step}
                    immediate={firstStart}
                    from={{
                      opacity: 0,
                      transform: `translate3d(${5 * GU * direction}px, 0, 0)`,
                    }}
                    enter={{
                      opacity: 1,
                      transform: 'translate3d(0, 0, 0)',
                      position: 'static',
                    }}
                    leave={{
                      opacity: 0,
                      transform: `translate3d(${5 * GU * -direction}px, 0, 0)`,
                      position: 'absolute',
                    }}
                    onRest={(_, status) => {
                      if (status === 'update') {
                        setApplyStaticHeight(false)
                      }
                    }}
                    onStart={onStart}
                    native
                  >
                    {currentStep => animProps => {
                      const currentScreen = screensRef.current[currentStep]

                      // Bail on rendering if screens is updated and currentScreen no longer exists
                      return currentScreen ? (
                        <AnimatedDiv
                          ref={elt => {
                            if (elt) {
                              setHeight(elt.clientHeight)
                            }
                          }}
                          style={{
                            // For better performance we avoid reflows between screen changes by matching the screen width with the modal width
                            width: Math.min(
                              viewportWidth,
                              currentScreen.width || DEFAULT_MODAL_WIDTH
                            ),
                            padding: smallMode ? 3 * GU : 5 * GU,
                            ...animProps,
                          }}
                        >
                          {renderScreen(currentScreen)}
                        </AnimatedDiv>
                      ) : (
                        false
                      )
                    }}
                  </Transition>
                </AnimatedDiv>
              )}
            </Spring>
          </Modal>
        )
      }}
    </Viewport>
  )
}

MultiScreenModal.defaultProps = {
  onClose: noop,
}

MultiScreenModal.propTypes = {
  visible: PropTypes.bool,
  screens: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.func,
      disableClose: PropTypes.bool,
      width: PropTypes.number,
    })
  ).isRequired,
  onClose: PropTypes.func,
}

export default React.memo(MultiScreenModal)
