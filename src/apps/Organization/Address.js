import React from 'react'
import PropTypes from 'prop-types'
import { Box, Info, GU, textStyle } from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { network } from '../../environment'

const Address = ({
  checksummedDaoAddr,
  shortAddresses,
  depositFundsHelpText,
}) => (
  <Box padding={3 * GU} heading="Organization address">
    <p
      css={`
        ${textStyle('body2')}
      `}
    >
      {checksummedDaoAddr
        ? `This organization is deployed on the Ethereum ${network.name}.`
        : 'Resolving DAO address…'}
    </p>
    {checksummedDaoAddr && (
      <React.Fragment>
        <div
          css={`
            margin-top: ${2 * GU}px;
            margin-bottom: ${3 * GU}px;
          `}
        >
          <LocalIdentityBadge
            entity={checksummedDaoAddr}
            shorten={shortAddresses}
          />
        </div>
        <Info>
          <strong css="font-weight: 800">
            Do not send ETH or ERC20 tokens to this address.
          </strong>{' '}
          {depositFundsHelpText}
        </Info>
      </React.Fragment>
    )}
  </Box>
)

Address.propTypes = {
  checksummedDaoAddr: PropTypes.string.isRequired,
  shortAddresses: PropTypes.bool.isRequired,
  depositFundsHelpText: PropTypes.string.isRequired,
}

export default Address
