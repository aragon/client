import React, { useCallback } from 'react'
import { Field, GU, Slider, TextInput, textStyle, useTheme } from '@aragon/ui'

function PercentageField({ label = 'Percentage', value, onChange }) {
  const theme = useTheme()

  const handleSliderChange = useCallback(
    v => {
      onChange(Math.round(v * 100))
    },
    [onChange]
  )
  const handleInputChange = useCallback(
    event => {
      const value = parseInt(event.target.value, 10)
      if (!isNaN(value) && value >= 0 && value <= 100) {
        onChange(value)
      }
    },
    [onChange]
  )
  return (
    <Field label={label}>
      {({ id }) => (
        <div
          css={`
            display: flex;
            flex-direction: row;
          `}
        >
          <Slider
            value={value / 100}
            onUpdate={handleSliderChange}
            css={`
              flex-grow: 1;
              padding-left: 0;
              padding-right: 0;
              margin-right: ${3 * GU}px;
              min-width: ${20 * GU}px;
            `}
          />
          <div
            css={`
              position: relative;
              flex-grow: 0;
              flex-shrink: 0;
              width: ${8 * GU}px;
            `}
          >
            <TextInput
              id={id}
              value={value}
              onChange={handleInputChange}
              wide
              css={`
                padding-right: ${3.5 * GU}px;
                text-align: right;
              `}
            />
            <span
              css={`
                position: absolute;
                top: 0;
                right: ${1.5 * GU}px;
                bottom: 0;
                display: flex;
                align-items: center;
                ${textStyle('body3')};
                color: ${theme.surfaceContent};
                pointer-events: none;
              `}
            >
              %
            </span>
          </div>
        </div>
      )}
    </Field>
  )
}

export default PercentageField
