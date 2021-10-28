import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, Link, GU, Info } from '@aragon/ui'
import styled from 'styled-components'

import { isAddress } from '../../util/web3'
import { useWallet } from '../../contexts/wallet'
import { getNetworkFullName, getNetworkShortName } from '../../util/network'
import { useDetectDao } from '../../hooks/useDetectDao'
import { useRouting } from '../../routing'
import { trackEvent, events } from '../../analytics'

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  const { loading, networks } = useDetectDao(dao)
  const { networkType } = useWallet()

  useEffect(() => {
    // analytics
    trackEvent(events.DAO_NOT_FOUND, {
      dao_identifier: dao,
      network: networkType,
    })
  }, [dao, networkType])

  return (
    <React.Fragment>
      <ModalTitle color={theme.surfaceContent}>
        Organization not found
      </ModalTitle>
      <MessageContainer>
        {loading ? (
          <Message color={theme.surfaceContentSecondary}>
            Searching for it on other networks...
          </Message>
        ) : networks?.length ? (
          <NotFoundOnNetworkMessage dao={dao} alternatives={networks} />
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
  alternatives: PropTypes.arrayOf(PropTypes.string),
}

function NotFoundOnNetworkMessage({ dao, alternatives }) {
  const theme = useTheme()
  const routing = useRouting()
  const { networkType, changeNetworkTypeDisconnected } = useWallet()

  const goToOrg = useCallback(
    (orgAddress, networType) => {
      changeNetworkTypeDisconnected(networType)
      routing.update(locator => ({
        ...locator,
        mode: { name: 'org', orgAddress },
      }))
    },
    [routing, changeNetworkTypeDisconnected]
  )

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
          <li key={a}>
            <Link onClick={() => goToOrg(dao, a)}>
              Open {!isAddress(dao) ? dao : 'it'} on {getNetworkShortName(a)}
            </Link>
          </li>
        ))}
      </LinksList>
    </React.Fragment>
  )
}

const ModalTitle = styled.h1`
  color: ${props => props.color};
  ${textStyle('title2')};
  margin-bottom: ${1.5 * GU}px;
  text-align: center;
`

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
