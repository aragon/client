import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, ButtonText, Card, GU, Info } from '@aragon/ui'
import { network } from '../../environment'
import { isAddress } from '../../web3-utils'
import notFoundImage from '../../assets/dao-not-found.png'

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  return (
    <Card
      css={`
        display: grid;
        grid-template-rows: 1fr auto auto auto;
        grid-template-columns: 1fr;
        text-align: center;
        padding: ${2 * GU}px;
        width: 579px;
        height: auto;
        box-shadow: 0px 2px 4px rgba(180, 188, 202, 0.5);
      `}
    >
      <img
        src={notFoundImage}
        alt="DAO not found"
        css={`
          width: 147px;
          height: 144px;
          margin: auto;
          margin-bottom: ${1.5 * GU}px;
        `}
      />
      <h1
        css={`
          color: ${theme.feedbackSurfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        Organization not found
      </h1>
      <div
        css={`
          color: ${theme.feedbackSurfaceContentSecondary};
          ${textStyle('body2')};
          margin: auto;
          margin-bottom: ${6 * GU}px;
          max-width: 417px;
        `}
      >
        It looks like there's no organization associated with{' '}
        {isAddress(dao) ? (
          <span css="font-weight: bold;">“{dao}”</span>
        ) : (
          <React.Fragment>
            the <span css="font-weight: bold;">“{dao}”</span> ENS domain
          </React.Fragment>
        )}
        on the Ethereum {network.name}.
      </div>
      <Info>
        If you arrived here through a link, please double check that you were
        given the correct link. Alternatively, you may
        <ButtonText onClick={() => window.location.reload(true)}>
          create a new organization
        </ButtonText>
      </Info>
    </Card>
  )
}

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

export default DAONotFoundError
