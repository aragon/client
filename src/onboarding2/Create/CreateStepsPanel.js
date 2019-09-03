import React from 'react'
import PropTypes from 'prop-types'
import { GU, useTheme } from '@aragon/ui'
import CreateStepsItem from './CreateStepsItem'
import CircleGraph from '../CircleGraph'

function CreateStepsPanel({ step, steps }) {
  const theme = useTheme()
  return (
    <aside
      css={`
        width: 100%;
        min-height: 100%;
        padding-top: ${10 * GU}px;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
      `}
    >
      <div
        css={`
          position: relative;
          display: flex;
          width: 100%;
          justify-content: center;
          height: ${25 * GU}px;
        `}
      >
        <CircleGraph value={step / (steps.length - 1)} size={25 * GU} />
        <div
          css={`
            position: absolute;
            top: 130px;
            font-size: 20px;
            color: #8e97b5;
            opacity: 0.7;
          `}
        >
          {`${step + 1}/${steps.length}`}
        </div>
      </div>
      <div
        css={`
          padding: ${8 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {steps.map((label, index) => (
          <CreateStepsItem
            key={index}
            currentStep={step}
            label={label}
            step={index}
          />
        ))}
      </div>
    </aside>
  )
}

CreateStepsPanel.propTypes = {
  step: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CreateStepsPanel
