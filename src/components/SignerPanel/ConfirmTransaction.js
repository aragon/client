import React from 'react'
import PropTypes from 'prop-types'
import { isElectron, noop } from '../../utils'
import ActionPathsContent from './ActionPathsContent'
import {
  needFrame,
  noWeb3Provider,
  accountLocked,
  wrongNetwork,
} from './Web3States'
import { ImpossibleContent } from './ImpossibleContent'

class ConfirmTransaction extends React.Component {
  static propTypes = {
    direct: PropTypes.bool.isRequired,
    hasAccount: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    intent: PropTypes.object,
    locator: PropTypes.object.isRequired,
    networkType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onRequestEnable: PropTypes.func,
    onSign: PropTypes.func.isRequired,
    paths: PropTypes.array.isRequired,
    pretransaction: PropTypes.object,
    signError: PropTypes.string,
    signingEnabled: PropTypes.bool.isRequired,
    walletNetworkType: PropTypes.string.isRequired,
    walletProviderId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    intent: {},
    onRequestEnable: noop,
  }
  render() {
    const {
      direct,
      hasAccount,
      hasWeb3,
      intent,
      locator,
      networkType,
      onClose,
      onRequestEnable,
      onSign,
      paths,
      pretransaction,
      signError,
      signingEnabled,
      walletNetworkType,
      walletProviderId,
    } = this.props

    if (!hasWeb3) {
      if (isElectron()) return needFrame(intent, onClose)
      return noWeb3Provider(intent, onClose)
    }

    if (!hasAccount) {
      return accountLocked(intent, onClose, walletProviderId, onRequestEnable)
    }

    if (walletNetworkType !== networkType) {
      return wrongNetwork(intent, onClose, networkType, walletProviderId)
    }

    const possible =
      (direct || (Array.isArray(paths) && paths.length)) && !signError

    return possible ? (
      <ActionPathsContent
        intent={intent}
        direct={direct}
        locator={locator}
        onSign={onSign}
        paths={paths}
        pretransaction={pretransaction}
        signingEnabled={signingEnabled}
        walletProviderId={walletProviderId}
      />
    ) : (
      <ImpossibleContent error={signError} intent={intent} onClose={onClose} />
    )
  }
}

export default ConfirmTransaction
