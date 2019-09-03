import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ButtonIcon, Modal, Viewport, springs } from '@aragon/ui'
import { Transition } from 'react-spring'
import { useArrows, useSteps } from '../../hooks'
import { highlights } from './content'
import Navigation from './Navigation'
import HighlightScreen, { RATIO_LEFT } from './HighlightScreen'
import ProgressBar from './ProgressBar'

import closeSvg from './assets/close.svg'

const UpgradeModal = React.memo(
  ({ visible, onUpgrade, onClose, canUpgradeOrg }) => {
    const content = highlights[canUpgradeOrg ? '0.6' : 'latest']
    const steps = content.length
    const { step, next, prev, setStep, direction } = useSteps(steps)

    // Keyboard navigation
    useArrows(visible ? { onLeft: prev, onRight: next } : {})

    useEffect(() => {
      if (visible) {
        setStep(0)
      }
    }, [setStep, visible])

    return (
      <Viewport>
        {({ width, height }) => {
          const verticalMode = width < 900
          const compactMode = width < 500 || height < 400
          return (
            <Modal
              padding={0}
              width={Math.min(1055, width - 40)}
              visible={visible}
              onClose={onClose}
              css={`
                z-index: 4;
              `}
            >
              <div
                css="position: relative"
                style={{
                  height: verticalMode
                    ? `${height - 40}px`
                    : `${Math.max(500, Math.min(620, height - 40))}px`,
                }}
              >
                <ProgressBar value={(step + 1) / steps} />

                <ButtonIcon
                  label="Close"
                  onClick={onClose}
                  css={`
                    position: absolute;
                    top: 17px;
                    right: 17px;
                    z-index: 2;
                  `}
                >
                  <img src={closeSvg} alt="" />
                </ButtonIcon>

                <div
                  css={`
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    display: flex;
                  `}
                >
                  <Transition
                    native
                    items={step}
                    from={{
                      enterProgress: 1 * direction,
                      showProgress: 0,
                    }}
                    initial={{
                      enterProgress: 0,
                      showProgress: 1,
                    }}
                    enter={{
                      enterProgress: 0,
                      showProgress: 1,
                    }}
                    leave={{
                      enterProgress: -1 * direction,
                      showProgress: 0,
                    }}
                    config={springs.smooth}
                  >
                    {(index, state) =>
                      /* eslint-disable react/prop-types */
                      ({ enterProgress, showProgress, status }) => (
                        <HighlightScreen
                          compactMode={compactMode}
                          onUpgrade={onUpgrade}
                          verticalMode={verticalMode}
                          enterProgress={enterProgress}
                          showProgress={showProgress}
                          state={state}
                          {...content[index]}
                        />
                      )
                    /* eslint-enable react/prop-types */
                    }
                  </Transition>
                </div>

                <div
                  css={`
                    position: relative;
                    z-index: 2;
                  `}
                  style={{
                    width: verticalMode ? '100%' : `${RATIO_LEFT * 100}%`,
                  }}
                >
                  <Navigation
                    step={step}
                    steps={steps}
                    onPrev={prev}
                    onNext={next}
                  />
                </div>
              </div>
            </Modal>
          )
        }}
      </Viewport>
    )
  }
)

UpgradeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpgrade: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  canUpgradeOrg: PropTypes.bool,
}

export default UpgradeModal
