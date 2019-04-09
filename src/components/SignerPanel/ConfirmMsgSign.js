import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info, SafeLink, theme } from '@aragon/ui'
import { isElectron, noop } from '../../utils'
import providerString from '../../provider-strings'
import SignMsgContent from './SignMsgContent'
import SignerButton from './SignerButton'
import AddressLink from './AddressLink'
import { AppType } from '../../prop-types'

class ConfirmMsgSign extends React.Component {
  static propTypes = {
    hasAccount: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    account: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    intent: PropTypes.object,
    onRequestEnable: PropTypes.func,
    onSign: PropTypes.func.isRequired,
    signError: PropTypes.string,
    signingEnabled: PropTypes.bool.isRequired,
    walletProviderId: PropTypes.string.isRequired,
    apps: PropTypes.arrayOf(AppType).isRequired,
  }

  static defaultProps = {
    intent: {},
    onRequestEnable: noop,
  }
  render() {
    const {
      intent,
      hasAccount,
      hasWeb3,
      onClose,
      onRequestEnable,
      onSign,
      signError,
      signingEnabled,
      walletProviderId,
      account,
      apps,
    } = this.props

    if (!hasWeb3) {
      if (isElectron()) {
        return (
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
      }
      return (
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
    }

    if (!hasAccount) {
      return (
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
    }

    const possible = !signError

    return possible ? (
      <SignMsgContent
        intent={intent}
        account={account}
        onSign={onSign}
        signingEnabled={signingEnabled}
        apps={apps}
      />
    ) : (
      <div>impossible</div>
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
      The action {description && `“${description}”`} failed to execute
      {name && (
        <React.Fragment>
          on <AddressLink to={to}>{name}</AddressLink>}
        </React.Fragment>
      )}
      .{' '}
      {error
        ? 'An error occurred when we tried to find a path or send a transaction for this action.'
        : 'You may not have the required permissions.'}
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
}

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

export default ConfirmMsgSign
