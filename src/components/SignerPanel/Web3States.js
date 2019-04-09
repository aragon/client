import React from 'react'
import PropTypes from 'prop-types'
import { Info, SafeLink, theme } from '@aragon/ui'
import styled from 'styled-components'

import AddressLink from './AddressLink'
import SignerButton from './SignerButton'
import providerString from '../../provider-strings'

const Web3ProviderError = ({
  intent: { description, name, to },
  onClose,
  neededText = '',
  actionText = '',
}) => (
  <React.Fragment>
    <Info.Action title="You can't perform any action">
      {neededText} in order to perform{' '}
      {description ? `"${description}"` : 'this action'}
      {name && (
        <React.Fragment>
          on <AddressLink to={to}>{name}</AddressLink>
        </React.Fragment>
      )}
      .<ActionMessage>{actionText}</ActionMessage>
    </Info.Action>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

Web3ProviderError.propTypes = {
  actionText: PropTypes.node.isRequired,
  intent: PropTypes.object.isRequired,
  neededText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ActionMessage = styled.p`
  margin-top: 15px;
`

const ButtonLink = styled.button.attrs({ type: 'button' })`
  padding: 0;
  font-size: inherit;
  text-decoration: underline;
  color: ${theme.textPrimary};
  cursor: pointer;
  background: none;
  border: 0;
`

export const needFrame = (intent, onClose) => (
  <Web3ProviderError
    intent={intent}
    onClose={onClose}
    neededText="You need to have Frame installed and enabled"
    actionText={
      <span>
        Please install and enable{' '}
        <SafeLink href="https://frame.sh/" target="_blank">
          Frame
        </SafeLink>
        .
      </span>
    }
  />
)

export const noWeb3Provider = (intent, onClose) => (
  <Web3ProviderError
    intent={intent}
    onClose={onClose}
    neededText="You need to have an Ethereum provider installed and enabled"
    actionText={
      <span>
        Please install and enable{' '}
        <SafeLink href="https://metamask.io/" target="_blank">
          Metamask
        </SafeLink>
        .
      </span>
    }
  />
)

export const accountLocked = (
  intent,
  onClose,
  walletProviderId,
  onRequestEnable
) => (
  <Web3ProviderError
    intent={intent}
    onClose={onClose}
    neededText={`You need to unlock and enable ${providerString(
      'your Ethereum provider',
      walletProviderId
    )}`}
    actionText={
      <span>
        Please unlock and{' '}
        <ButtonLink onClick={onRequestEnable}>enable</ButtonLink>{' '}
        {providerString('your Ethereum provider', walletProviderId)}.
      </span>
    }
  />
)

export const wrongNetwork = (
  intent,
  onClose,
  networkType,
  walletProviderId
) => (
  <Web3ProviderError
    intent={intent}
    onClose={onClose}
    neededText={`
      You need to be connected to the ${networkType} network
    `}
    actionText={`
      Please connect ${providerString(
        'your Ethereum provider',
        walletProviderId
      )} to the ${networkType} network.
    `}
  />
)
