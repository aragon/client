import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, IconSettings, Text, theme } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'

const MenuPanelFooter = ({
  account,
  connected,
  onOpenPreferences,
  onRequestEnable,
}) => {
  return (
    <div css="margin: 15px 20px">
      <ConnectionBullet connected={connected} />
      <Text size="xsmall">
        {connected ? 'Connected to the network' : 'Not connected'}
      </Text>
      <ConnectedAccount account={account} onRequestEnable={onRequestEnable} />
      <PreferencesButton onClick={onOpenPreferences} />
    </div>
  )
}

MenuPanelFooter.propTypes = {
  account: EthereumAddressType,
  connected: PropTypes.bool,
  onOpenPreferences: PropTypes.func.isRequired,
  onRequestEnable: PropTypes.func.isRequired,
}

const ConnectedAccount = ({ account, onRequestEnable }) => (
  <div css="margin-top: 12px">
    {account ? (
      <LocalIdentityBadge entity={account} />
    ) : (
      <Button
        size="small"
        mode="secondary"
        label="Preferences"
        onClick={onRequestEnable}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <span>Enable Account</span>
        </div>
      </Button>
    )}
  </div>
)

ConnectedAccount.propTypes = {
  account: EthereumAddressType,
  onRequestEnable: PropTypes.func.isRequired,
}

const PreferencesButton = ({ onClick }) => (
  <div css="margin-top: 12px">
    <Button size="small" mode="outline" label="Preferences" onClick={onClick}>
      <span
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <IconSettings css="margin: 0 6px 0 -3px" />
        <span>Preferences</span>
      </span>
    </Button>
  </div>
)
PreferencesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const ConnectionBullet = styled.span`
  width: 8px;
  height: 8px;
  margin-top: -2px;
  margin-right: 8px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ connected }) =>
    connected ? theme.positive : theme.negative};
`

export default MenuPanelFooter
