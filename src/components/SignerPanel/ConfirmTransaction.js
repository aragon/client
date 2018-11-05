import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info } from '@aragon/ui'
import { noop } from '../../utils'
import ActionPathsContent from './ActionPathsContent'
import SignerButton from './SignerButton'
import AddressLink from './AddressLink'

class ConfirmTransaction extends React.Component {
  static propTypes = {
    direct: PropTypes.bool.isRequired,
    hasAccount: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    intent: PropTypes.object.isRequired,
    networkType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSign: PropTypes.func.isRequired,
    paths: PropTypes.array.isRequired,
    pretransaction: PropTypes.string,
    signError: PropTypes.string,
    signingEnabled: PropTypes.bool.isRequired,
    walletNetworkType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    intent: {},
    paths: [],
    pretransaction: null,
    onClose: noop,
    onSign: noop,
  }
  render() {
    const {
      direct,
      hasAccount,
      hasWeb3,
      intent,
      networkType,
      onClose,
      onSign,
      paths,
      pretransaction,
      signError,
      signingEnabled,
      walletNetworkType,
    } = this.props

    if (!hasWeb3) {
      return (
        <Web3ProviderError
          intent={intent}
          onClose={onClose}
          neededText="You need to have a Web3 instance installed and enabled"
          actionText="Please enable your Ethereum provider."
        />
      )
    }

    if (!hasAccount) {
      return (
        <Web3ProviderError
          intent={intent}
          onClose={onClose}
          neededText="You need to unlock your account"
          actionText="Please unlock your Ethereum provider."
        />
      )
    }

    if (walletNetworkType !== networkType) {
      return (
        <Web3ProviderError
          intent={intent}
          onClose={onClose}
          neededText={`
            You need to be connected to the ${networkType} network
          `}
          actionText={`
            Please connect your Ethereum provider to the ${networkType} network.
          `}
        />
      )
    }

    const possible =
      (direct || (Array.isArray(paths) && paths.length)) && !signError

    return possible ? (
      <ActionPathsContent
        intent={intent}
        direct={direct}
        paths={paths}
        pretransaction={pretransaction}
        signingEnabled={signingEnabled}
        onSign={onSign}
      />
    ) : (
      <ImpossibleContent error={signError} intent={intent} onClose={onClose} />
    )
  }
}

const ImpossibleContent = ({
  error,
  intent: { description, name, to },
  onClose,
}) => (
  <React.Fragment>
    <Info.Permissions title="Action impossible">
      The action {description && `“${description}”`} failed to execute on{' '}
      <AddressLink to={to}>{name}</AddressLink>.{' '}
      {error
        ? 'An error occurred when we tried to find a path or send a transaction for this action.'
        : 'You might not have the necessary permissions.'}
    </Info.Permissions>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

ImpossibleContent.propTypes = {
  error: PropTypes.bool,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

const Web3ProviderError = ({
  intent: { description, name, to },
  onClose,
  neededText = '',
  actionText = '',
}) => {
  return (
    <React.Fragment>
      <Info.Action title="You can't perform any action">
        {neededText} in order to perform{' '}
        {description ? `"${description}"` : 'this action'}
        {' on '}
        <AddressLink to={to}>{name}</AddressLink>.
        <ActionMessage>{actionText}</ActionMessage>
      </Info.Action>
      <SignerButton onClick={onClose}>Close</SignerButton>
    </React.Fragment>
  )
}

Web3ProviderError.propTypes = {
  actionText: PropTypes.string.isRequired,
  intent: PropTypes.object.isRequired,
  neededText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ActionMessage = styled.p`
  margin-top: 15px;
`

export default ConfirmTransaction
