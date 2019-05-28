import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { font, theme } from '@aragon/ui'

const EditTextArea = ({ type, disabled, onChange, value, placeholder }) => (
  <TextArea
    type={type}
    disabled={disabled}
    onChange={onChange}
    value={value}
    placeholder={placeholder}
    rows={3}
  />
)

EditTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
}

EditTextArea.defaultProps = {
  editing: false,
  disabled: false,
  type: 'text',
  wide: false,
  value: '',
}

const baseStyles = css`
  ${font({ size: 'small', weight: 'normal' })};
  width: ${({ wide }) => (wide ? '100%' : 'auto')};
  padding: 0 10px;
  background: ${theme.contentBackground};
  border: 1px solid ${theme.contentBorder};
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
  color: ${theme.textPrimary};
  appearance: none;
  &:focus {
    outline: none;
    border-color: ${theme.contentBorderActive};
  }
  &:read-only {
    color: transparent;
    text-shadow: 0 0 0 ${theme.textSecondary};
  }
  width: 100%;
`

const TextArea = styled.textarea`
  ${baseStyles};
`

export default EditTextArea
