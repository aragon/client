import React from 'react'
import PropTypes from 'prop-types'
import { ButtonText, Info, GU } from '@aragon/ui'

import AddressLink from './AddressLink'
import SignerButton from './SignerButton'
import providerString from '../../provider-strings'
import { isElectron } from '../../utils'

const Web3ProviderError = ({
  intent: { description, name, to },
  onClose,
  neededText,
  actionText,
}) => (
  <React.Fragment>
    <Info mode="description" title="You can't perform any action">
      {neededText} in order to perform{' '}
      {description ? `“${description}”` : 'this action'}
      {name && (
        <React.Fragment>
          on <AddressLink to={to}>{name}</AddressLink>
        </React.Fragment>
      )}
      .
      <p
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        {actionText}
      </p>
    </Info>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

Web3ProviderError.propTypes = {
  actionText: PropTypes.node.isRequired,
  intent: PropTypes.object.isRequired,
  neededText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export const NoWeb3Provider = ({ intent, onClose }) => {
  const onElectron = isElectron()
  const neededText = onElectron
    ? 'You need to have Frame installed and enabled'
    : 'You need to have an Ethereum provider installed and enabled'

  const actionText = (
    <span>
      Please install and enable{' '}
      <ButtonText
        href={onElectron ? 'https://frame.sh/' : 'https://metamask.io/'}
        target="_blank"
        horizontalPadding="none"
        css={`
          padding: 0;
          font-weight: 600;
        `}
      >
        {onElectron ? 'Frame' : 'Metamask'}
      </ButtonText>
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
}) => {
  const providerMessage = providerString(
    'your Ethereum provider',
    walletProviderId
  )
  return (
    <Web3ProviderError
      intent={intent}
      onClose={onClose}
      neededText={`You need to unlock and enable ${providerMessage}`}
      actionText={
        <span>
          Please unlock and{' '}
          <ButtonText
            onClick={onRequestEnable}
            horizontalPadding="none"
            css={`
              padding: 0;
              font-weight: 600;
            `}
          >
            enable
          </ButtonText>{' '}
          {providerMessage}.
        </span>
      }
    />
  )
}

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
