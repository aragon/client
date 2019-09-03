import React, { useCallback } from 'react'
import { Field, GU, TextInput, useTheme } from '@aragon/ui'
import Check from './Check'

export const DOMAIN_CHECK = Symbol('DOMAIN_CHECK')
export const DOMAIN_LOADING = Symbol('DOMAIN_LOADING')
export const DOMAIN_ERROR = Symbol('DOMAIN_ERROR')
export const DOMAIN_NONE = Symbol('DOMAIN_NONE')

function DomainField({
  endLevels = '.aragonid.eth',
  label = 'Name of the organization',
  onChange,
  placeholder = 'Type an organization name',
  status = DOMAIN_CHECK,
  value,
  ...props
}) {
  const theme = useTheme()

  const handleInputChange = useCallback(
    event => {
      onChange(event.target.value)
    },
    [onChange]
  )

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        flex-grow: 1;
      `}
      {...props}
    >
      <div
        css={`
          display: flex;
          width: 100%;
        `}
      >
        <Field label={label} css="width: 100%">
          <TextInput
            wide
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            adornment={
              <div
                css={`
                  height: 100%;
                  display: flex;
                  align-items: center;
                  border-left: 1px solid ${theme.border};
                  padding: 0 ${2 * GU}px;
                `}
              >
                {endLevels}
              </div>
            }
            adornmentPosition="end"
          />
        </Field>
        {status !== DOMAIN_NONE && (
          <div
            css={`
              display: flex;
              align-items: center;
              height: ${5 * GU}px;
              margin-top: ${2.5 * GU}px;
              margin-left: ${2 * GU}px;
            `}
          >
            {status === DOMAIN_CHECK && <Check />}
          </div>
        )}
      </div>
    </div>
  )
}

export default DomainField
