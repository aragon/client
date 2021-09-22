import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, Link, GU, Info } from '@aragon/ui'
import styled from 'styled-components'

import { isAddress } from '../../util/web3'
import { useWallet } from '../../contexts/wallet'
import { getNetworkFullName } from '../../util/network'

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  // mock object, to be determined dynamically as specified in DAO-269
  const alternativeNetworks = ['polygon', 'ropsten']

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
      <MessageContainer>
        {alternativeNetworks.length ? (
          <NotFoundOnNetworkMessage
            dao={dao}
            alternatives={alternativeNetworks}
          />
        ) : (
          <NotFoundAtAllMessage dao={dao} />
        )}
      </MessageContainer>
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

NotFoundAtAllMessage.propTypes = {
  dao: PropTypes.string,
}

function NotFoundAtAllMessage({ dao }) {
  const theme = useTheme()
  const { networkType } = useWallet()

  return (
    <Message color={theme.surfaceContentSecondary}>
      There’s no organization associated with{' '}
      <span css="font-weight: bold;">'{dao}'</span>
      on the {getNetworkFullName(networkType)}.
    </Message>
  )
}

NotFoundOnNetworkMessage.propTypes = {
  dao: PropTypes.string,
  alternatives: PropTypes.string,
}

function NotFoundOnNetworkMessage({ dao, alternatives }) {
  const theme = useTheme()
  const { networkType } = useWallet()

  return (
    <React.Fragment>
      <Message color={theme.surfaceContentSecondary}>
        There’s no organization associated with{' '}
        <span css="font-weight: bold;">'{dao}'</span> on the{' '}
        {getNetworkFullName(networkType)}, but it does exist on another chain.
        You may switch the application to another chain to see it.
      </Message>
      <LinksList>
        {alternatives.map(a => (
          <li>
            <Link>
              Open {!isAddress(dao) ? dao : 'it'} on {a}
            </Link>
          </li>
        ))}
      </LinksList>
    </React.Fragment>
  )
}

const MessageContainer = styled.div`
  margin-bottom: ${6 * GU}px;
  text-align: center;
`

const Message = styled.p`
  ${textStyle('body2')};
  color: ${props => props.color};
`

const LinksList = styled.ul`
  list-style: none;
  padding-top: ${2 * GU}px;
`

export default DAONotFoundError
