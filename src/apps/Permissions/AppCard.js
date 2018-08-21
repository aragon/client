import React from 'react'
import styled from 'styled-components'
import { Text, Card, Badge, theme, unselectable } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import AppIcon from './AppIcon'

class AppCard extends React.PureComponent {
  handleClick = () => {
    this.props.onOpen(this.props.app.proxyAddress)
  }
  render() {
    const { app } = this.props
    const { name, identifier, proxyAddress, baseUrl } = app
    const instanceLabel = identifier || shortenAddress(proxyAddress)
    const instanceTitle = `Address: ${proxyAddress}`
    return (
      <Main onClick={this.handleClick}>
        <Icon>
          <AppIcon app={app} />
        </Icon>
        <Name>{name}</Name>
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

const Icon = styled.div`
  height: 28px;
  margin-bottom: 5px;
  img {
    display: block;
  }
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
