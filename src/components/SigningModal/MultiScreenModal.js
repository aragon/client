import React, { useCallback, useState, useEffect, useMemo } from 'react'
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
import { useSteps, useDeferredAnimation } from '../../hooks'

const AnimatedDiv = animated.div

const DEFAULT_MODAL_WIDTH = 85 * GU

function useScreens(screens) {
  const { direction, next, prev, step } = useSteps(screens.length)
  const [screensState, setScreensState] = useState(screens)

  useEffect(() => {
    setScreensState(screens)
  }, [screens])

  const getScreen = useCallback(step => screensState[step], [screensState])

  const currentScreen = useMemo(() => getScreen(step), [getScreen, step])

  return {
    currentScreen,
    direction,
    getScreen,
    next,
    prev,
    step,
  }
}

function MultiScreenModal({ visible, screens, onClose }) {
  const { prev, step, next, direction, getScreen, currentScreen } = useScreens(
    screens
  )
  const [applyStaticHeight, setApplyStaticHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [immediateAnimation, onAnimationStart] = useDeferredAnimation()
  const { below } = useViewport()

  const smallMode = below('medium')

  const { disableClose, width } = currentScreen

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
              immediate={immediateAnimation}
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
                    immediate={immediateAnimation}
                    from={{
                      opacity: 0,
                      transform: `translate3d(${5 * GU * direction}px, 0, 0)`,
                    }}
                    enter={{
                      opacity: 1,
                      transform: 'translate3d(0, 0, 0)',
                    }}
                    leave={{
                      opacity: 0,
                      transform: `translate3d(${5 * GU * -direction}px, 0, 0)`,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    onRest={(_, status) => {
                      if (status === 'update') {
                        setApplyStaticHeight(false)
                      }
                    }}
                    onStart={onAnimationStart}
                    native
                  >
                    {step => animProps => {
                      const currentScreen = getScreen(step)

                      return (
                        <React.Fragment>
                          {currentScreen && (
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
                          )}
                        </React.Fragment>
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
