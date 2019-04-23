import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { noop } from '../../utils'

import { AppType } from '../../prop-types'
import { ImpossibleContent } from './ImpossibleContent'
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
      <ImpossibleContent
        error={!!signError}
        intent={intent}
        onClose={onClose}
      />
    )}
  </Fragment>
)

ConfirmMsgSign.propTypes = {
  account: PropTypes.string.isRequired,
  apps: PropTypes.arrayOf(AppType).isRequired,
  intent: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  signError: PropTypes.string,
  signingEnabled: PropTypes.bool.isRequired,
}

ConfirmMsgSign.defaultProps = {
  intent: {},
  onRequestEnable: noop,
}

export default ConfirmMsgSign
