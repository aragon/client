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
  { label, onChange, placeholder, error, value, ...props },
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
        <Field label={label} css="width: 100%">
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
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
}

AddressField.defaultProps = {
  label: 'Address',
  placeholder: 'Type an address',
}

export default AddressField
