import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Info, GU, Link } from '@aragon/ui'
import {
  useCheckDomain,
  DOMAIN_CHECK,
  DOMAIN_ERROR,
} from '../../../check-domain'
import { DomainField, Header, Navigation, ScreenPropsType } from '..'

function ClaimDomainScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
  screenTitle,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}
  const nextScreen = screens[screenIndex + 1]

  const [domain, setDomain] = useState(screenData.domain || '')
  const [displayError, setDisplayError] = useState(false)
  const domainCheckStatus = useCheckDomain(domain, true)

  const handleDomainChange = useCallback(domain => {
    setDomain(domain)
    setDisplayError(false)
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      setDisplayError(domainCheckStatus === DOMAIN_ERROR)
      if (domainCheckStatus === DOMAIN_CHECK) {
        next(dataKey ? { ...data, [dataKey]: domain } : { ...data, domain })
      }
    },
    [data, dataKey, domain, domainCheckStatus, next]
  )

  // focus on mount
  const handleDomainFieldRef = useCallback(ref => {
    if (ref) {
      ref.focus()
    }
  }, [])

  return (
    <form>
      <Header title={screenTitle} />

      <DomainField
        ref={handleDomainFieldRef}
        label="Organization’s name"
        onChange={handleDomainChange}
        value={domain}
        status={domainCheckStatus}
      />

      {displayError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          This organization domain name already exists. You may want to try a
          different one.
        </Info>
      )}

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        Aragon uses the{' '}
        <Link href="https://ens.domains/">Ethereum Name Service (ENS)</Link> to
        assign names to organizations. The name you choose will be mapped to
        your organization’s Ethereum address and cannot be changed after you
        launch your organization.
      </Info>

      <Navigation
        backEnabled
        nextEnabled={Boolean(nextScreen && domain.trim())}
        nextLabel={
          nextScreen ? `Next: ${nextScreen[0]}` : 'Launch your organization'
        }
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

ClaimDomainScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
  screenTitle: PropTypes.string,
}

ClaimDomainScreen.defaultProps = {
  dataKey: null,
  screenTitle: 'Claim a name',
}

export default ClaimDomainScreen
