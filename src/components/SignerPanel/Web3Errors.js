import React from 'react'
import PropTypes from 'prop-types'
import { Info, Link, GU } from '@aragon/ui'

import AddressLink from './AddressLink'
import SignerButton from './SignerButton'
import { getProviderString } from '../../ethereum-providers'
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
          {' '}
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
      <Link
        href={onElectron ? 'https://frame.sh/' : 'https://metamask.io/'}
        css="font-weight: 600"
      >
        {onElectron ? 'Frame' : 'Metamask'}
      </Link>
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
  const providerMessage = getProviderString(
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
          <Link
            onClick={onRequestEnable}
            focusRingSpacing={[3, 2]}
            css="font-weight: 600"
          >
            enable
          </Link>{' '}
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
      Please connect ${getProviderString(
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
