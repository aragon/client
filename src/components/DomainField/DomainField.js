import React, { useCallback, useImperativeHandle, useRef } from 'react'
import PropTypes from 'prop-types'
import { Field, GU, TextInput, LoadingRing, useTheme } from '@aragon/ui'
import CheckDisc from '../CheckDisc/CheckDisc'
import {
  DOMAIN_CHECK,
  DOMAIN_ERROR,
  DOMAIN_LOADING,
  DOMAIN_NONE,
} from '../../check-domain'

// Filter a subdomain
function filterSubdomain(subdomain, detectFullDomains) {
  const subdomainFiltered = subdomain.trim().toLowerCase()
  return detectFullDomains
    ? subdomainFiltered.replace(/\.\./g, '.')
    : subdomainFiltered.replace(/[^a-z0-9]/g, '').slice(0, 30)
}

const DomainField = React.forwardRef(function DomainField(
  {
    detectFullDomains,
    domainEnd,
    focusRef,
    label,
    onChange,
    placeholder,
    status,
    value,
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

  const handleInputChange = useCallback(
    event => {
      const subdomain = filterSubdomain(event.target.value, detectFullDomains)
      onChange(subdomain, subdomain + domainEnd)
    },
    [domainEnd, onChange, detectFullDomains]
  )

  const displayDomainEnd =
    Boolean(domainEnd) && !(detectFullDomains && value.includes('.'))

  return (
    <div
      css={`
        display: flex;
        align-items: center;
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
            ref={inputRef}
            wide
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            adornment={
              <div
                css={`
                  display: ${displayDomainEnd ? 'flex' : 'none'};
                  align-items: center;
                  height: calc(100% - 2px);
                  margin: 1px 0;
                  padding: 0 ${2 * GU}px;
                  border-left: 1px solid ${theme.border};
                  background: ${theme.surface};
                `}
              >
                {domainEnd}
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
            {status === DOMAIN_CHECK && <CheckDisc mode="success" />}
            {status === DOMAIN_LOADING && (
              <LoadingRing
                css={`
                  width: ${3 * GU}px;
                  height: ${3 * GU}px;
                `}
              />
            )}
            {status === DOMAIN_ERROR && <CheckDisc mode="error" />}
          </div>
        )}
      </div>
    </div>
  )
})

DomainField.propTypes = {
  detectFullDomains: PropTypes.bool,
  domainEnd: PropTypes.string,
  focusRef: PropTypes.array,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  status: PropTypes.oneOf([
    DOMAIN_CHECK,
    DOMAIN_ERROR,
    DOMAIN_LOADING,
    DOMAIN_NONE,
  ]),
  value: PropTypes.string.isRequired,
}

DomainField.defaultProps = {
  detectFullDomains: false,
  domainEnd: '.aragonid.eth',
  label: 'Name of the organization',
  placeholder: 'Type an organization name',
  status: DOMAIN_CHECK,
}

export default DomainField
