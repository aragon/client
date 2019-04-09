import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, IconSettings, Text, theme } from '@aragon/ui'

const MenuPanelFooter = ({ connected, onOpenPreferences }) => (
  <div css="margin: 15px 20px">
    <ConnectionBullet connected={connected} />
    <Text size="xsmall">
      {connected ? 'Connected to the network' : 'Not connected'}
    </Text>
    <PreferencesButton onClick={onOpenPreferences} />
  </div>
)

MenuPanelFooter.propTypes = {
  connected: PropTypes.bool,
  onOpenPreferences: PropTypes.func.isRequired,
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
