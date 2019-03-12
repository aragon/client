import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, Card, Badge, theme, unselectable } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { shortenAddress } from '../../web3-utils'
import AppIcon from './AppIcon'

class AppCard extends React.PureComponent {
  static propTypes = {
    app: AppType.isRequired,
    onOpen: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onOpen(this.props.app.proxyAddress)
  }
  render() {
    const { app } = this.props
    // Note: We could also use app.isAragonOsInternalApp,
    // but we can just merge system and contract-only apps
    // so the user doesn't get lost in a sea of app types
    const { name, identifier, hasWebApp, proxyAddress } = app
    const instanceLabel = !hasWebApp
      ? 'System App'
      : identifier || shortenAddress(proxyAddress)
    const instanceTitle = `Address: ${proxyAddress}`
    return (
      <Main onClick={this.handleClick}>
        <AppIconCard app={app} size={28} />
        <Name>{name || 'Unknown'}</Name>
        <IdentifierWrapper>
          <Identifier title={instanceTitle}>{instanceLabel}</Identifier>
        </IdentifierWrapper>
        <Action>
          <Text weight="bold" color={theme.textSecondary}>
            View
          </Text>
        </Action>
      </Main>
    )
  }
}

const Main = styled(Card).attrs({ width: '100%', height: '180px' })`
  ${unselectable};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
  cursor: pointer;
`

const AppIconCard = styled(AppIcon)`
  margin-bottom: 5px;
`

const Name = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
`

const IdentifierWrapper = styled.div`
  max-width: 100%;
  padding: 0 20px;
  margin-bottom: 10px;
`

const Identifier = styled(Badge.App)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

const Action = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 30px;
  text-align: center;
`

export default AppCard
