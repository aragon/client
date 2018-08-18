import React from 'react'
import styled from 'styled-components'
import resolvePathname from 'resolve-pathname'
import { Text, Card, Badge, theme, unselectable } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'

class AppCard extends React.PureComponent {
  handleClick = () => {
    this.props.onOpen(this.props.app.proxyAddress)
  }
  render() {
    const {
      app: { name, identifier, proxyAddress, baseUrl },
    } = this.props
    const iconUrl = resolvePathname('images/icon.svg', baseUrl)
    const instanceLabel = identifier || shortenAddress(proxyAddress)
    const instanceTitle = `Address: ${proxyAddress}`
    return (
      <Main onClick={this.handleClick}>
        <div className="icon">
          <img width="28" height="28" src={iconUrl} alt="" />
        </div>
        <p className="name">{name}</p>
        <div className="identifier">
          <Identifier title={instanceTitle}>{instanceLabel}</Identifier>
        </div>
        <div className="link">
          <Text weight="bold" color={theme.textSecondary}>
            View
          </Text>
        </div>
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
  .icon {
    height: 28px;
    margin-bottom: 5px;
    img {
      display: block;
    }
  }
  .name {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
  .identifier {
    max-width: 100%;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  .link {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 30px;
    text-align: center;
    a {
      text-decoration: underline;
    }
  }
`

const Identifier = styled(Badge.App)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

export default AppCard
