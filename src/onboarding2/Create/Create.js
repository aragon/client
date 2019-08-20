import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { useArrows } from '../../hooks'
import Templates from '../Templates/Templates'
import CreateStepsPanel from './CreateStepsPanel'

const STEPS = [
  'Startup',
  'Claim domain',
  'Configure template',
  'Review information',
  'Launch organization',
]

function Create() {
  const [step, setStep] = useState(1)

  const prevStep = useCallback(() => {
    setStep(step => Math.max(step - 1, 0))
  }, [])

  const nextStep = useCallback(() => {
    setStep(step => Math.min(step + 1, STEPS.length - 1))
  }, [])

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        min-height: 100%;
        flex-grow: 1;
      `}
    >
      <div
        css={`
          width: ${41 * GU}px;
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        <CreateStepsPanel step={step} steps={STEPS} />
      </div>
      <section
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
        `}
      >
        <StepScreen step={step} onNext={nextStep} onPrev={prevStep} />
      </section>
    </div>
  )
}

function StepScreen({ step, onNext, onPrev }) {
  useArrows({
    onLeft: onPrev,
    onRight: onNext,
  })
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}
    >
      <Templates />
    </div>
  )
}

StepScreen.propTypes = {
  step: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
}

export default Create
