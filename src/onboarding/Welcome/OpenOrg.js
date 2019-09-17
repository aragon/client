import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  BackButton,
  Bar,
  Box,
  Button,
  GU,
  Info,
  useKeyDown,
  useTheme,
} from '@aragon/ui'
import KEYS from '../../keycodes'
import DomainField from '../../components/DomainField/DomainField'
import { useCheckDomain, DOMAIN_CHECK, DOMAIN_ERROR } from '../../check-domain'

function OpenOrg({ onOpenOrg, onBack }) {
  const theme = useTheme()
  const [domainValue, setDomainValue] = useState('')
  const [displayError, setDisplayError] = useState(false)
  const domainCheckStatus = useCheckDomain(domainValue)

  const handleDomainChange = useCallback((subdomain, domain) => {
    setDomainValue(subdomain)
    setDisplayError(false)
  }, [])

  const handleSubmit = useCallback(() => {
    setDisplayError(domainCheckStatus === DOMAIN_ERROR)
    if (domainCheckStatus === DOMAIN_CHECK) {
      onOpenOrg(domainValue)
    }
  }, [domainValue, onOpenOrg, domainCheckStatus])

  useKeyDown(KEYS.esc, () => {
    onBack()
  })

  // focus on mount
  const handleDomainFieldRef = useCallback(ref => {
    if (ref) {
      ref.focus()
    }
  }, [])

  return (
    <Box padding={5 * GU}>
      <Bar
        css={`
          margin: -${5 * GU}px -${5 * GU}px 0;
          border: 0;
          border-bottom: 1px solid ${theme.border};
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
      >
        <BackButton onClick={onBack} />
      </Bar>

      <form
        onSubmit={handleSubmit}
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: ${36 * GU}px;
        `}
      >
        <div
          css={`
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            justify-content: center;
          `}
        >
          <div css="position: relative">
            <DomainField
              ref={handleDomainFieldRef}
              detectFullDomains
              value={domainValue}
              onChange={handleDomainChange}
              status={domainCheckStatus}
              label="Name of existing organization"
            />
            {displayError && (
              <Info
                mode="error"
                css={`
                  position: absolute;
                  top: ${10.5 * GU}px;
                  width: 100%;
                `}
              >
                This organization doesn’t seem to exist.
              </Info>
            )}
          </div>
        </div>
        <div
          css={`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button
            label="Open organization"
            mode="strong"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Box>
  )
}

OpenOrg.propTypes = {
  onBack: PropTypes.func.isRequired,
  onOpenOrg: PropTypes.func.isRequired,
}

export default OpenOrg
