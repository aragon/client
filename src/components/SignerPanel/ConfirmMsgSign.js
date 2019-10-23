import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { AppType, EthereumAddressType } from '../../prop-types'
import SignMsgContent from './SignMsgContent'

const ConfirmMsgSign = ({
  account,
  apps,
  intent,
  onClose,
  onSign,
  signingEnabled,
}) => (
  <Fragment>
    <SignMsgContent
      account={account}
      apps={apps}
      intent={intent}
      onSign={onSign}
      signingEnabled={signingEnabled}
    />
  </Fragment>
)

ConfirmMsgSign.propTypes = {
  account: EthereumAddressType.isRequired,
  apps: PropTypes.arrayOf(AppType).isRequired,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  signingEnabled: PropTypes.bool,
}

export default ConfirmMsgSign
