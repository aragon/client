import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Transition, animated } from 'react-spring'
import {
  Button,
  IconRotateRight,
  Info,
  noop,
  springs,
  useTheme,
  GU,
} from '@aragon/ui'
import Step from './Step/Step'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
  STEPPER_WORKING,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
} from './stepper-statuses'
import { useDetectIsMounted, useDeferredAnimation } from '../../../hooks'
import useStepperLayout from './useStepperLayout'

const AnimatedDiv = animated.div

const DEFAULT_STEP_DESC = {
  [STEP_WAITING]: 'Waiting for signature',
  [STEP_PROMPTING]: 'Waiting for signature',
  [STEP_WORKING]: 'Transaction being mined',
  [STEP_SUCCESS]: 'Transaction confirmed',
  [STEP_ERROR]: 'An error has occured',
}

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

function TransactionStepper({
  steps,
  onComplete,
  infoDescriptions,
  className,
}) {
  const theme = useTheme()
  const isMounted = useDetectIsMounted()
  const [immediateAnimation, onAnimationStart] = useDeferredAnimation()
  const [stepperStatus, setStepperStatus] = useState(STEPPER_WORKING)
  const [stepperStage, setStepperStage] = useState(0)
  const [stepState, updateStep] = useReducer(
    reduceSteps,
    initialStepState(steps)
  )
  const { outerBoundsRef, innerBoundsRef, layout } = useStepperLayout()

  const stepsCount = steps.length - 1

  const infoMessage =
    (infoDescriptions && infoDescriptions[stepperStatus]) || ''

  const renderStep = useCallback(
    (stepIndex, showDivider) => {
      const { title, descriptions } = steps[stepIndex]
      const { status, hash } = stepState[stepIndex]
      const stepDesc =
        (descriptions && descriptions[status]) || DEFAULT_STEP_DESC[status]

      return (
        <li
          key={stepIndex}
          css={`
            display: flex;
          `}
        >
          <Step
            title={title}
            desc={stepDesc}
            number={stepIndex + 1}
            status={status}
            showDivider={showDivider}
            transactionHash={hash}
          />
        </li>
      )
    },
    [stepState, steps]
  )

  const renderSteps = useCallback(() => {
    return steps.map((_, index) => {
      const showDivider = index < stepsCount

      return renderStep(index, showDivider)
    })
  }, [steps, stepsCount, renderStep])

  const updateStepperStatus = useCallback(
    status => {
      if (isMounted()) {
        setStepperStatus(status)
      }
    },
    [isMounted]
  )

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
    const { handleSign } = steps[stepperStage]

    // Always start new step in the "Prompting" state
    updateStepStatus(STEP_PROMPTING)
    updateStepperStatus(STEPPER_WORKING)

    // Pass state updates as render props to signProcess
    handleSign({
      setStepHash: hash => updateHash(hash),
      setStepWorking: () => updateStepStatus(STEP_WORKING),
      setStepError: () => {
        updateStepStatus(STEP_ERROR)
        updateStepperStatus(STEPPER_ERROR)
      },
      setStepSuccess: () => {
        updateStepStatus(STEP_SUCCESS)

        // Advance to next step or fire complete callback
        if (isMounted()) {
          if (stepperStage === stepsCount) {
            onComplete()
            updateStepperStatus(STEPPER_SUCCESS)
          } else {
            setStepperStage(stepperStage + 1)
          }
        }
      },
    })
  }, [
    steps,
    stepperStage,
    updateStepStatus,
    updateStepperStatus,
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
      {infoMessage && (
        <Info
          css={`
            margin-top: ${4 * GU}px;
          `}
        >
          {infoMessage}
        </Info>
      )}

      {stepperStatus === STEPPER_ERROR && (
        <Button
          mode="strong"
          wide
          onClick={handleSign}
          icon={<IconRotateRight />}
          label="Repeat transaction"
          css={`
            margin-top: ${1 * GU}px;
          `}
        />
      )}
    </div>
  )
}

TransactionStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      handleSign: PropTypes.func.isRequired,
      descriptions: PropTypes.shape({
        [STEP_WAITING]: PropTypes.string,
        [STEP_PROMPTING]: PropTypes.string,
        [STEP_WORKING]: PropTypes.string,
        [STEP_SUCCESS]: PropTypes.string,
        [STEP_ERROR]: PropTypes.string,
      }),
    })
  ).isRequired,
  infoDescriptions: PropTypes.shape({
    [STEPPER_WORKING]: PropTypes.string,
    [STEPPER_SUCCESS]: PropTypes.string,
    [STEPPER_ERROR]: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func,
  className: PropTypes.string,
}

TransactionStepper.defaultProps = {
  onComplete: noop,
}

export default TransactionStepper
