import React from 'react'
import PropTypes from 'prop-types'
import ActionPathsContent from './ActionPathsContent'
import ImpossibleAction from './ImpossibleAction'

function ConfirmTransaction({
  direct,
  intent,
  onClose,
  onSign,
  paths,
  pretransaction,
  signError,
  signingEnabled,
  walletProviderId,
}) {
  const possible =
    (direct || (Array.isArray(paths) && paths.length)) && !signError

  return possible ? (
    <ActionPathsContent
      direct={direct}
      intent={intent}
      onSign={onSign}
      paths={paths}
      pretransaction={pretransaction}
      signingEnabled={signingEnabled}
      walletProviderId={walletProviderId}
    />
  ) : (
    <ImpossibleAction error={signError} intent={intent} onClose={onClose} />
  )
}

ConfirmTransaction.propTypes = {
  direct: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  paths: PropTypes.array.isRequired,
  pretransaction: PropTypes.object,
  signError: PropTypes.bool,
  signingEnabled: PropTypes.bool,
  walletProviderId: PropTypes.string.isRequired,
}

export default ConfirmTransaction
