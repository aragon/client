import React, { useImperativeHandle, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  TextInput,
  useTheme,
  textStyle,
  GU,
  RADIUS,
  EthIdenticon,
} from '@aragon/ui'

const AddressField = React.forwardRef(function AddressField(
  {
    label,
    subtitle,
    onChange,
    placeholder,
    error,
    value,
    noFieldMargin,
    ...props
  },
  ref
) {
  const theme = useTheme()
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    },
  }))

  return (
    <div>
      <div
        css={`
          display: flex;
          width: 100%;
        `}
      >
        <Field
          label={label}
          css={`
            width: 100%;
            ${noFieldMargin ? `margin-bottom: 0px;` : ''}
          `}
        >
          {typeof subtitle === 'string' ? (
            <div
              css={`
                ${textStyle('body3')};
              `}
            >
              {subtitle}
            </div>
          ) : (
            subtitle
          )}
          <TextInput
            css={`
              border-color: ${error ? theme.negative : theme.border};
            `}
            ref={inputRef}
            wide
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            adornment={
              <EthIdenticon address={error ? '' : value} radius={RADIUS} />
            }
            adornmentPosition="start"
          />
          <div
            css={`
              color: ${theme.negative};
              ${textStyle('body4')};
              min-height: ${2 * GU}px;
            `}
          >
            {error}
          </div>
        </Field>
      </div>
    </div>
  )
})

AddressField.propTypes = {
  label: PropTypes.node,
  subtitle: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  noFieldMargin: PropTypes.bool,
}

AddressField.defaultProps = {
  label: 'Address',
  placeholder: 'Type an address',
  noFieldMargin: false,
}

export default AddressField
