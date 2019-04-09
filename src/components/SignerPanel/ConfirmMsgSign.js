import React from 'react'
import PropTypes from 'prop-types'
import { isElectron, noop } from '../../utils'
import SignMsgContent from './SignMsgContent'
import { AppType } from '../../prop-types'
import { needFrame, noWeb3Provider, accountLocked } from './Web3States'
import { ImpossibleContent } from './ImpossibleContent'

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
      if (isElectron()) return needFrame(intent, onClose)
      return noWeb3Provider(intent, onClose)
    }

    if (!hasAccount) {
      return accountLocked(intent, onClose, walletProviderId, onRequestEnable)
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
      <ImpossibleContent
        error={!!signError}
        intent={intent}
        onClose={onClose}
      />
    )
  }
}

export default ConfirmMsgSign
