import React, { useCallback, useState } from 'react'
import { Info, GU, SafeLink } from '@aragon/ui'
import {
  DOMAIN_CHECK,
  DOMAIN_NONE,
  DomainField,
  Header,
  PrevNextFooter,
} from '.'

function ClaimDomain({
  back,
  data,
  next,
  screenIndex,
  screens,
  screenTitle = 'Claim a name',
}) {
  const [domain, setDomain] = useState(data.domain || '')

  const handleNext = useCallback(() => {
    next({ ...data, domain })
  }, [data, domain, next])

  return (
    <React.Fragment>
      <Header title={screenTitle} />

      <DomainField
        label="Organization's name"
        onChange={setDomain}
        value={domain}
        status={domain ? DOMAIN_CHECK : DOMAIN_NONE}
      />

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        Aragon uses the{' '}
        <SafeLink href="https://ens.domains/" target="_blank">
          Ethereum Name Service (ENS)
        </SafeLink>
        {' '} to assig names to organizations. The name you choose will be
        mapped to your organization’s Ethereum address and cannot be changed
        after you launch your organization.
      </Info>

      <PrevNextFooter
        backEnabled
        nextEnabled={Boolean(domain && !domain.startsWith('.'))}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleNext}
      />
    </React.Fragment>
  )
}

export default ClaimDomain
