import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info, Text, SidePanelSeparator } from '@aragon/ui'

import SignerButton from './SignerButton'
import ToggleContent from '../ToggleContent'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import AppInstanceLabel from '../../apps/Permissions/AppInstanceLabel'
import { AppType } from '../../prop-types'
import { isHumanReadable } from '../../utils'

const SignMsgContent = ({ apps, account, intent, onSign, signingEnabled }) => {
  const locateAppInfo = (apps, requestingApp) => {
    const app = apps.find(({ proxyAddress }) => proxyAddress === requestingApp)
    return app
  }

  const humanReadableMessage = isHumanReadable(intent.message)
  return (
    <React.Fragment>
      <SmMarginRight>
        {'You are about to sign this message with the connected account '}
        <LocalIdentityBadge entity={account} fontSize="xsmall" />
      </SmMarginRight>
      <Seperator />
      <Text smallcaps>Signature requested by:</Text>
      <br />
      <AppInstanceLabel
        app={locateAppInfo(apps, intent.requestingApp)}
        proxyAddress={intent.requestingApp}
        showIcon
      />
      <Seperator />
      {humanReadableMessage ? (
        <React.Fragment>
          <Text smallcaps>Message:</Text>
          <br />
          <Info>{intent.message}</Info>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ToggleContent label="Show Message">
            <React.Fragment>
              <br />
              <Info>{intent.message}</Info>
            </React.Fragment>
          </ToggleContent>
        </React.Fragment>
      )}
      <SignerButton onClick={onSign} disabled={!signingEnabled}>
        Create signature request
      </SignerButton>
    </React.Fragment>
  )
}

SignMsgContent.propTypes = {
  intent: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  onSign: PropTypes.func.isRequired,
  signingEnabled: PropTypes.bool.isRequired,
  apps: PropTypes.arrayOf(AppType).isRequired,
}

const Seperator = styled(SidePanelSeparator)`
  margin-top: 12px;
  margin-bottom: 12px;
`

const SmMarginRight = styled.span`
  margin-right: 4px;
`

export default SignMsgContent
