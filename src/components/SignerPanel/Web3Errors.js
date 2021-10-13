import React from 'react'
import PropTypes from 'prop-types'
import { Info, Link, GU } from '@aragon/ui'

import AddressLink from './AddressLink'
import SignerButton from './SignerButton'
import { getProviderString } from 'use-wallet'
import { isElectron } from '../../util/utils'

function Web3ProviderError({
  intent: { description, name, to },
  onClose,
  neededText,
  actionText,
}) {
  return (
    <React.Fragment>
      <Info mode="description" title="You can’t perform any action">
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
}

Web3ProviderError.propTypes = {
  actionText: PropTypes.node.isRequired,
  intent: PropTypes.object.isRequired,
  neededText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export function NoWeb3Provider({ intent, onClose }) {
  const onElectron = isElectron()
  const neededText = onElectron
    ? 'You need to have Frame installed and enabled'
    : 'You need to have a wallet installed and enabled'

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

export function AccountLocked({ intent, onClose, walletProviderId }) {
  const providerMessage = getProviderString('your wallet', walletProviderId)
  return (
    <Web3ProviderError
      intent={intent}
      onClose={onClose}
      neededText={`You need to unlock and enable ${providerMessage}`}
      actionText={<span>Please connect your account.</span>}
    />
  )
}

AccountLocked.propTypes = {
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export function WrongNetwork({
  intent,
  networkType,
  onClose,
  walletProviderId,
}) {
  return (
    <Web3ProviderError
      intent={intent}
      onClose={onClose}
      neededText={`
      You need to be connected to the ${networkType} network
    `}
      actionText={`
      Please connect ${getProviderString(
        'your wallet',
        walletProviderId
      )} to the ${networkType} network.
    `}
    />
  )
}

WrongNetwork.propTypes = {
  intent: PropTypes.object.isRequired,
  networkType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}
