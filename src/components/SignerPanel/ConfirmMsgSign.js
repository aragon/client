import React from 'react'
import PropTypes from 'prop-types'
import { isElectron, noop } from '../../utils'

import { AppType } from '../../prop-types'
import { NoWeb3Provider, AccountLocked } from './Web3Errors'
import { ImpossibleContent } from './ImpossibleContent'
import SignMsgContent from './SignMsgContent'

class ConfirmMsgSign extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    apps: PropTypes.arrayOf(AppType).isRequired,
    hasAccount: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    intent: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onRequestEnable: PropTypes.func,
    onSign: PropTypes.func.isRequired,
    signError: PropTypes.string,
    signingEnabled: PropTypes.bool.isRequired,
    walletProviderId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    account: '',
    intent: {},
    onRequestEnable: noop,
  }
  render() {
    const {
      account,
      apps,
      intent,
      hasAccount,
      hasWeb3,
      onClose,
      onRequestEnable,
      onSign,
      signError,
      signingEnabled,
      walletProviderId,
    } = this.props

    if (!hasWeb3) {
      return (
        <NoWeb3Provider
          intent={intent}
          isElectron={isElectron()}
          onClose={onClose}
        />
      )
    }

    if (!hasAccount) {
      return (
        <AccountLocked
          intent={intent}
          onClose={onClose}
          onRequestEnable={onRequestEnable}
          walletProviderId={walletProviderId}
        />
      )
    }

    return !signError ? (
      <SignMsgContent
        account={account}
        apps={apps}
        intent={intent}
        onSign={onSign}
        signingEnabled={signingEnabled}
      />
    ) : (
      <ImpossibleContent
        error={!!signError}
        intent={intent}
        onClose={onClose}
      />
    )
  }
}

export default ConfirmMsgSign
