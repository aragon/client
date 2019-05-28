import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from '@aragon/ui'

const EditTextField = ({
  type,
  disabled,
  onChange,
  value,
  placeholder,
  className,
}) => (
  <TextInput
    className={className}
    type={type}
    disabled={disabled}
    onChange={onChange}
    value={value}
    placeholder={placeholder}
  />
)

EditTextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
}

EditTextField.defaultProps = {
  disabled: false,
  type: 'text',
  value: '',
  className: '',
}

export default EditTextField
