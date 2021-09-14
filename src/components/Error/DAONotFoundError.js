import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, Link, GU, Info } from '@aragon/ui'
import { isAddress } from '../../util/web3'
import { useWallet } from '../../contexts/wallet'
import { getNetworkName } from '../../network-config'

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  const { networkType } = useWallet()

  return (
    <React.Fragment>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        Organization not found
      </h1>
      <div
        css={`
          margin-bottom: ${6 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        It looks like there’s no organization associated with{' '}
        {isAddress(dao) ? (
          <span css="font-weight: bold;">“{dao}”</span>
        ) : (
          <React.Fragment>
            the <strong>“{dao}”</strong> ENS domain
          </React.Fragment>
        )}{' '}
        on the Ethereum {getNetworkName(networkType)}.
      </div>
      <Info>
        If you arrived here through a link, please double check that you were
        given the correct link. Alternatively, you may{' '}
        <Link
          onClick={() => {
            window.location = '/'
          }}
        >
          create a new organization.
        </Link>
      </Info>
    </React.Fragment>
  )
}

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

export default DAONotFoundError
