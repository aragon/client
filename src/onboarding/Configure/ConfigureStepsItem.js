import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { GU, IconCheck, useTheme } from '@aragon/ui'

function ConfigureStepsItem({ stepNumber, step, label, currentStep }) {
  const theme = useTheme()

  const stepStyles = useMemo(() => {
    if (step === currentStep) {
      return `
        padding-top: 2px;
        background: ${theme.selected};
        color: ${theme.selectedContent};
      `
    }
    if (step < currentStep) {
      return `
        background: ${theme.positive};
        color: ${theme.positiveContent};
      `
    }
    return `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `
  }, [step, currentStep, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${5 * GU}px;
        & + & {
          margin-top: ${3 * GU}px;
        }
      `}
    >
      <div
        css={`
          width: ${5 * GU}px;
          height: ${5 * GU}px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          font-weight: 600;
          ${stepStyles};
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        {step < currentStep ? <IconCheck /> : stepNumber}
      </div>
      <div
        css={`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${step === currentStep ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {label}
      </div>
    </div>
  )
}

ConfigureStepsItem.propTypes = {
  currentStep: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired,
  stepNumber: PropTypes.number.isRequired,
}

export default ConfigureStepsItem
