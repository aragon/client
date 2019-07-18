import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { AppType, EthereumAddressType } from '../../prop-types'
import ImpossibleContent from './ImpossibleContent'
import SignMsgContent from './SignMsgContent'

const ConfirmMsgSign = ({
  account,
  apps,
  intent,
  onClose,
  onSign,
  signError,
  signingEnabled,
}) => (
  <Fragment>
    {!signError ? (
      <SignMsgContent
        account={account}
        apps={apps}
        intent={intent}
        onSign={onSign}
        signingEnabled={signingEnabled}
      />
    ) : (
      <ImpossibleContent error={signError} intent={intent} onClose={onClose} />
    )}
  </Fragment>
)

ConfirmMsgSign.propTypes = {
  account: EthereumAddressType.isRequired,
  apps: PropTypes.arrayOf(AppType).isRequired,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  signError: PropTypes.bool,
  signingEnabled: PropTypes.bool,
}

export default ConfirmMsgSign
