import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge, Link, useLayout, GU } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import InfoField from './InfoField'
import { getIpfsCidFromUri, getIpfsUrlfromUri } from '../../url-utils'

function AgreementDetails({ ipfsUri, stakingAddress, contractAddress }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <React.Fragment>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <InfoField
          label="Agreement IPFS Link"
          css={`
            ${!compactMode && 'grid-column: span 2;'};
          `}
        >
          <Link
            href={getIpfsUrlfromUri(ipfsUri)}
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
              {getIpfsCidFromUri(ipfsUri)}
            </span>
          </Link>
        </InfoField>
      </div>
      <div
        css={`
          display: grid;
          grid-gap: ${compactMode ? 3 * GU : 4 * GU}px;
          grid-auto-flow: ${compactMode ? 'row' : 'column'};
        `}
      >
        <InfoField label="Arbitrator">Aragon Court</InfoField>
        <InfoField label="Staking Pool">
          <IdentityBadge entity={stakingAddress} />
        </InfoField>
        <InfoField label="Agreement Contract">
          <IdentityBadge entity={contractAddress} />
        </InfoField>
      </div>
    </React.Fragment>
  )
}

AgreementDetails.propTypes = {
  ipfsUri: PropTypes.string,
  stakingAddress: EthereumAddressType,
  contractAddress: EthereumAddressType,
}

export default AgreementDetails
