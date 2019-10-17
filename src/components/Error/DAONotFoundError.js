import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, Link, Card, GU, Info } from '@aragon/ui'
import { network } from '../../environment'
import { isAddress } from '../../web3-utils'
import notFoundImage from '../../assets/dao-not-found.png'

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  return (
    <Card
      css={`
        display: block;
        padding: ${5 * GU}px ${6 * GU}px;
        width: 100%;
        max-width: ${72 * GU}px;
        height: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      `}
    >
      <img
        src={notFoundImage}
        alt=""
        width="147"
        height="144"
        css={`
          display: block;
          margin: ${5 * GU}px auto ${1.5 * GU}px;
        `}
      />
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
        on the Ethereum {network.name}.
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
    </Card>
  )
}

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

export default DAONotFoundError
