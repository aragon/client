import React, { useCallback, useState } from 'react'
import { Info, GU, Link } from '@aragon/ui'
import { useCheckDomain, DOMAIN_CHECK, DOMAIN_ERROR } from '../../check-domain'
import { DomainField, Header, PrevNextFooter } from '.'

function ClaimDomain({
  back,
  data,
  next,
  screenIndex,
  screens,
  screenTitle = 'Claim a name',
}) {
  const [domain, setDomain] = useState(data.domain || '')
  const [displayError, setDisplayError] = useState(false)
  const domainCheckStatus = useCheckDomain(domain, true)

  const handleDomainChange = useCallback(domain => {
    setDomain(domain)
    setDisplayError(false)
  }, [])

  const handleNext = useCallback(() => {
    setDisplayError(domainCheckStatus === DOMAIN_ERROR)
    if (domainCheckStatus === DOMAIN_CHECK) {
      next({ ...data, domain })
    }
  }, [domain, next, data, domainCheckStatus])

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
        label="Organization's name"
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

      <PrevNextFooter
        backEnabled
        nextEnabled={Boolean(domain.trim())}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleNext}
      />
    </form>
  )
}

export default ClaimDomain
