import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'

const MenuPanelFooter = ({ connected }) => (
  <div css="margin: 15px 20px;">
    <ConnectionBullet connected={connected} />
    <Text size="xsmall">
      {connected ? 'Connected to the network' : 'Not connected'}
    </Text>
  </div>
)

MenuPanelFooter.propTypes = {
  connected: PropTypes.bool,
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
