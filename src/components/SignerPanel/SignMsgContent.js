import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Info, GU, textStyle, useTheme } from '@aragon/ui'
import SignerButton from './SignerButton'
import ToggleContent from './ToggleContent'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'
import { AppType, EthereumAddressType } from '../../prop-types'
import { isHumanReadable } from '../../util/utils'

const SignMsgContent = ({ apps, account, intent, onSign, signingEnabled }) => {
  const { message, requestingApp: requestingAppAddress } = intent

  const requestingApp = useMemo(
    () =>
      apps.find(({ proxyAddress }) => proxyAddress === requestingAppAddress),
    [apps, requestingAppAddress]
  )
  const humanReadableMessage = isHumanReadable(message)

  return (
    <React.Fragment>
      <p
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        You are about to sign this message with the connected account{' '}
        <LocalIdentityBadge entity={account} compact />.
      </p>
      <Label>Signature requested by</Label>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <AppInstanceLabel
          app={requestingApp}
          proxyAddress={requestingAppAddress}
          showIcon
        />
      </div>
      {humanReadableMessage ? (
        <React.Fragment>
          <Label>Message</Label>
          <Info mode="description">{message}</Info>
        </React.Fragment>
      ) : (
        <ToggleContent labelOpen="Hide message" labelClosed="Show message">
          <Info mode="description">{message}</Info>
        </ToggleContent>
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

function Label(props) {
  const theme = useTheme()
  return (
    <div
      css={`
        ${textStyle('label2')}
        color: ${theme.surfaceContentSecondary};
        margin-bottom: ${2 * GU}px;
      `}
      {...props}
    />
  )
}

export default SignMsgContent
