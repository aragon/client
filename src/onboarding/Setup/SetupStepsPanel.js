import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { GU, useTheme } from '@aragon/ui'
import ConfigureStepsItem from './ConfigureStepsItem'
import CircleGraph from '../CircleGraph'

function SetupStepsPanel({ step, steps }) {
  const theme = useTheme()

  // Mark identical siblings to only show the last step
  const [groupedSteps, displayedSteps] = useMemo(() => {
    // these get updated by the .map() to avoid another iteration
    let displayCount = 0

    const groupedSteps = steps.map((step, index) => {
      const hiddenCount = index - displayCount

      if (step !== steps[index + 1]) {
        displayCount++
        return [index, index - hiddenCount, true]
      }

      let statusIndex = index
      while (step === steps[statusIndex + 1] && statusIndex < steps.length) {
        statusIndex++
      }

      return [
        // The index used for the status in the panel (last of the group)
        statusIndex,
        // The index used for the display in the panel (first of the group)
        index - hiddenCount,
        // Do not display the step
        false,
      ]
    })

    return [groupedSteps, displayCount]
  }, [steps])

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
        <CircleGraph
          value={groupedSteps[step][1] / (displayedSteps - 1)}
          size={25 * GU}
        />
        <div
          css={`
            position: absolute;
            top: 130px;
            font-size: 20px;
            color: #8e97b5;
            opacity: 0.7;
          `}
        >
          {`${groupedSteps[step][1] + 1}/${displayedSteps}`}
        </div>
      </div>
      <div
        css={`
          padding: ${8 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {groupedSteps.map(
          ([statusIndex, displayIndex, show], index) =>
            show && (
              <ConfigureStepsItem
                key={index}
                currentStep={groupedSteps[step][0]}
                label={steps[statusIndex]}
                step={statusIndex}
                stepNumber={displayIndex + 1}
              />
            )
        )}
      </div>
    </aside>
  )
}

SetupStepsPanel.propTypes = {
  step: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default SetupStepsPanel
