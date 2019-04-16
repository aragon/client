import React from 'react'
import PropTypes from 'prop-types'
import { isElectron, noop } from '../../utils'
import ActionPathsContent from './ActionPathsContent'
import { NoWeb3Provider, AccountLocked, WrongNetwork } from './Web3Errors'
import { ImpossibleContent } from './ImpossibleContent'

class ConfirmTransaction extends React.Component {
  static propTypes = {
    direct: PropTypes.bool.isRequired,
    hasAccount: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    intent: PropTypes.object,
    dao: PropTypes.string,
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
      dao,
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

    if (walletNetworkType !== networkType) {
      return (
        <WrongNetwork
          intent={intent}
          onClose={onClose}
          networkType={networkType}
          walletProviderId={walletProviderId}
        />
      )
    }

    const possible =
      (direct || (Array.isArray(paths) && paths.length)) && !signError

    return possible ? (
      <ActionPathsContent
        intent={intent}
        direct={direct}
        dao={dao}
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
