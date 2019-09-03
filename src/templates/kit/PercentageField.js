import React, { useCallback } from 'react'
import { Field, GU, Slider, TextInput } from '@aragon/ui'

function PercentageField({ label = 'Percentage', value, onChange }) {
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
          `}
        />
        <TextInput
          value={`${value}%`}
          onChange={handleInputChange}
          css={`
            flex-grow: 0;
            flex-shrink: 0;
            width: ${12 * GU}px;
            text-align: center;
          `}
        />
      </div>
    </Field>
  )
}

export default PercentageField
