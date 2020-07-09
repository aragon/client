import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Transition, animated } from 'react-spring'
import { noop, useTheme, springs, GU } from '@aragon/ui'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from './stepper-statuses'
import { useDetectIsMounted, useDeferredAnimation } from '../../../hooks'
import useStepperLayout from './useStepperLayout'
import Step from './Step/Step'

const AnimatedDiv = animated.div

function initialStepState(steps) {
  return steps.map((_, i) => {
    return {
      status: i === 0 ? STEP_PROMPTING : STEP_WAITING,
      hash: null,
    }
  })
}

function reduceSteps(steps, [action, stepIndex, value]) {
  if (action === 'setHash') {
    steps[stepIndex].hash = value
    return [...steps]
  }
  if (action === 'setStatus') {
    steps[stepIndex].status = value
    return [...steps]
  }
  return steps
}

function TransactionStepper({ steps, onComplete, className }) {
  const theme = useTheme()
  const isMounted = useDetectIsMounted()
  const [immediateAnimation, onAnimationStart] = useDeferredAnimation()
  const [stepperStage, setStepperStage] = useState(0)
  const [stepState, updateStep] = useReducer(
    reduceSteps,
    initialStepState(steps)
  )
  const { outerBoundsRef, innerBoundsRef, layout } = useStepperLayout()

  const stepsCount = steps.length - 1

  const renderStep = (stepIndex, showDivider) => {
    const title = steps[stepIndex][0]
    const { status, hash } = stepState[stepIndex]

    return (
      <li
        key={stepIndex}
        css={`
          display: flex;
        `}
      >
        <Step
          title={title}
          number={stepIndex + 1}
          status={status}
          showDivider={showDivider}
          transactionHash={hash}
        />
      </li>
    )
  }

  const renderSteps = () => {
    return steps.map((_, index) => {
      const showDivider = index < stepsCount

      return renderStep(index, showDivider)
    })
  }

  const updateStepStatus = useCallback(
    status => {
      if (isMounted()) {
        updateStep(['setStatus', stepperStage, status])
      }
    },
    [stepperStage, isMounted]
  )

  const updateHash = useCallback(
    hash => {
      if (isMounted()) {
        updateStep(['setHash', stepperStage, hash])
      }
    },
    [stepperStage, isMounted]
  )

  const handleSign = useCallback(() => {
    const signProcess = steps[stepperStage][1]

    // Always start new step in the "Prompting" state
    updateStepStatus(STEP_PROMPTING)

    // Pass state updates as render props to signProcess
    signProcess({
      setStepHash: hash => updateHash(hash),
      setStepWorking: () => updateStepStatus(STEP_WORKING),
      setStepError: () => updateStepStatus(STEP_ERROR),
      setStepSuccess: () => {
        updateStepStatus(STEP_SUCCESS)

        // Advance to next step or fire complete callback
        if (isMounted()) {
          stepperStage === stepsCount
            ? onComplete()
            : setStepperStage(stepperStage + 1)
        }
      },
    })
  }, [
    steps,
    stepperStage,
    updateStepStatus,
    updateHash,
    onComplete,
    stepsCount,
    isMounted,
  ])

  useEffect(handleSign, [stepperStage])

  return (
    <div className={className}>
      <div
        ref={outerBoundsRef}
        css={`
          display: flex;
          justify-content: center;
        `}
      >
        <ul
          ref={innerBoundsRef}
          css={`
            padding: 0;
            display: flex;
            flex-direction: ${layout === 'collapsed' ? 'column' : 'row'};
          `}
        >
          {layout === 'collapsed' && (
            <React.Fragment>
              {steps.length > 1 && (
                <p
                  css={`
                    text-align: center;
                    color: ${theme.contentSecondary};
                  `}
                >
                  {stepperStage + 1} out of {steps.length} transactions
                </p>
              )}

              <div
                css={`
                  position: relative;
                `}
              >
                <Transition
                  config={springs.smooth}
                  delay={300}
                  items={stepperStage}
                  immediate={immediateAnimation}
                  onStart={onAnimationStart}
                  from={{
                    opacity: 0,
                    transform: `translate3d(${10 * GU}px, 0, 0)`,
                  }}
                  enter={{
                    opacity: 1,
                    transform: 'translate3d(0, 0, 0)',
                  }}
                  leave={{
                    opacity: 0,
                    transform: `translate3d(-${20 * GU}px, 0, 0)`,
                  }}
                  native
                >
                  {currentStage => animProps => (
                    <AnimatedDiv
                      style={{
                        position:
                          currentStage === stepperStage ? 'static' : 'absolute',
                        ...animProps,
                      }}
                    >
                      {renderStep(currentStage)}
                    </AnimatedDiv>
                  )}
                </Transition>
              </div>
            </React.Fragment>
          )}
          {layout === 'expanded' && renderSteps()}
        </ul>
      </div>
    </div>
  )
}

TransactionStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.array).isRequired,
  onComplete: PropTypes.func,
  className: PropTypes.string,
}

TransactionStepper.defaultProps = {
  onComplete: noop,
}

export default TransactionStepper
