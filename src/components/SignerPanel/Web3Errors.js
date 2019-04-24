import React from 'react'
import PropTypes from 'prop-types'
import { Info, SafeLink, theme } from '@aragon/ui'
import styled from 'styled-components'

import AddressLink from './AddressLink'
import SignerButton from './SignerButton'
import providerString from '../../provider-strings'
import { isElectron } from '../../utils'

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

export const NoWeb3Provider = ({ intent, onClose }) => {
  const onElectron = isElectron()
  const neededText = onElectron
    ? 'You need to have Frame installed and enabled'
    : 'You need to have an Ethereum provider installed and enabled'

  const actionText = (
    <span>
      Please install and enable{' '}
      <SafeLink
        href={onElectron ? 'https://frame.sh/' : 'https://metamask.io/'}
        target="_blank"
      >
        {onElectron ? 'Frame' : 'Metamask'}
      </SafeLink>
      .
    </span>
  )

  return (
    <Web3ProviderError
      intent={intent}
      onClose={onClose}
      neededText={neededText}
      actionText={actionText}
    />
  )
}

NoWeb3Provider.propTypes = {
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export const AccountLocked = ({
  intent,
  onClose,
  onRequestEnable,
  walletProviderId,
}) => (
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

AccountLocked.propTypes = {
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestEnable: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export const WrongNetwork = ({
  intent,
  networkType,
  onClose,
  walletProviderId,
}) => (
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

WrongNetwork.propTypes = {
  intent: PropTypes.object.isRequired,
  networkType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}
