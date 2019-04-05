import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info, Text, SidePanelSeparator } from '@aragon/ui'
import SignerButton from './SignerButton'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'

const SignMsgContent = ({ intent, account, onSign, signingEnabled }) => (
  <React.Fragment>
    <span style={{ marginRight: '4px' }}>
      {`${intent.description} `}
      <LocalIdentityBadge entity={account} fontSize="xsmall" />
    </span>
    <Seperator />
    <Text smallcaps>Signature requested by:</Text>
    <br />
    <LocalIdentityBadge entity={intent.from} fontSize="xsmall" />
    <Seperator />
    <Text smallcaps>Message:</Text>
    <br />
    <Info.Action icon={null} title={null}>
      {intent.message}
    </Info.Action>
    <SignerButton onClick={onSign} disabled={!signingEnabled}>
      Create signature request
    </SignerButton>
  </React.Fragment>
)

SignMsgContent.propTypes = {
  intent: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  onSign: PropTypes.func.isRequired,
  signingEnabled: PropTypes.bool.isRequired,
}

const Seperator = styled(SidePanelSeparator)`
  margin-top: 12px;
  margin-bottom: 12px;
`

export default SignMsgContent
