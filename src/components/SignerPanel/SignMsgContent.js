import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info, Text, SidePanelSeparator, theme } from '@aragon/ui'

import SignerButton from './SignerButton'
import ToggleContent from './ToggleContent'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'
import { AppType, EthereumAddressType } from '../../prop-types'
import { isHumanReadable } from '../../utils'

const SignMsgContent = ({ apps, account, intent, onSign, signingEnabled }) => {
  const locateAppInfo = (apps, requestingApp) =>
    apps.find(({ proxyAddress }) => proxyAddress === requestingApp)

  const humanReadableMessage = isHumanReadable(intent.message)
  return (
    <React.Fragment>
      <span css="margin-right: 4px">
        You are about to sign this message with the connected account{' '}
        <LocalIdentityBadge entity={account} />
      </span>
      <Separator />
      <Label smallcaps>Signature requested by</Label>
      <AppInstanceLabel
        app={locateAppInfo(apps, intent.requestingApp)}
        proxyAddress={intent.requestingApp}
        showIcon
      />
      <Separator />
      {humanReadableMessage ? (
        <React.Fragment>
          <Label smallcaps>Message</Label>
          <br />
          <Info>{intent.message}</Info>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ToggleContent labelOpen="Hide message" labelClosed="Show message">
            <React.Fragment>
              <br />
              <Info>{intent.message}</Info>
            </React.Fragment>
          </ToggleContent>
        </React.Fragment>
      )}
      <SignerButton onClick={onSign} disabled={!signingEnabled}>
        Sign message
      </SignerButton>
    </React.Fragment>
  )
}

SignMsgContent.propTypes = {
  account: EthereumAddressType.isRequired,
  apps: PropTypes.arrayOf(AppType).isRequired,
  intent: PropTypes.object.isRequired,
  onSign: PropTypes.func.isRequired,
  signingEnabled: PropTypes.bool,
}

const Separator = styled(SidePanelSeparator)`
  margin-top: 18px;
  margin-bottom: 18px;
`

const Label = styled(Text).attrs({
  smallcaps: true,
  color: theme.textSecondary,
})`
  display: block;
  margin-bottom: 10px;
`

export default SignMsgContent
