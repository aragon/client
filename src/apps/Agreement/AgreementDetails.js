import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge, Link, useLayout, GU } from '@aragon/ui'
import InfoField from './InfoField'

function AgreementDetails({ IPFSLink, AuthorHash, StakingHash, ContractHash }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <div
      css={`
        display: grid;
        grid-gap: ${compactMode ? 3 * GU : 4 * GU}px;
        grid-template-columns: ${compactMode
          ? 'minmax(0, 1fr)'
          : '1fr 1fr 1fr'};
      `}
    >
      <InfoField
        label="Agreement IPFS Link"
        css={`
          ${!compactMode && 'grid-column: span 2;'};
        `}
      >
        <Link
          href=""
          css={`
            max-width: 90%;
          `}
        >
          <span
            css={`
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
            `}
          >
            {IPFSLink}
          </span>
        </Link>
      </InfoField>
      <InfoField label="Created by">
        <IdentityBadge customLabel="Wesley Crusher" entity={AuthorHash} />
      </InfoField>
      <InfoField label="Arbitrator">Aragon Court</InfoField>
      <InfoField label="Staking Pool">
        <IdentityBadge entity={StakingHash} />
      </InfoField>
      <InfoField label="Agreement Contract">
        <IdentityBadge entity={ContractHash} />
      </InfoField>
    </div>
  )
}

AgreementDetails.propTypes = {
  IPFSLink: PropTypes.string,
  AuthorHash: PropTypes.string,
  StakingHash: PropTypes.string,
  ContractHash: PropTypes.string,
}

export default AgreementDetails
