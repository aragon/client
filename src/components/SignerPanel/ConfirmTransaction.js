import React from 'react'
import PropTypes from 'prop-types'
import ActionPathsContent from './ActionPathsContent'
import ImpossibleContent from './ImpossibleContent'

const ConfirmTransaction = ({
  direct,
  intent,
  dao,
  onClose,
  onSign,
  paths,
  pretransaction,
  signError,
  signingEnabled,
  walletProviderId,
}) => {
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

ConfirmTransaction.propTypes = {
  direct: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  dao: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  paths: PropTypes.array.isRequired,
  pretransaction: PropTypes.object,
  signError: PropTypes.bool,
  signingEnabled: PropTypes.bool,
  walletProviderId: PropTypes.string.isRequired,
}

export default ConfirmTransaction
