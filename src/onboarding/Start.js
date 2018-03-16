import React from 'react'
import styled from 'styled-components'
import { theme, Text, Button } from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import logo from './assets/logo-welcome.svg'

class Start extends React.Component {
  static defaultProps = {
    account: '',
    hideProgress: 0,
    onCreate: noop,
    onJoin: noop,
  }
  render() {
    const { hideProgress, onCreate, onJoin, account } = this.props
    return (
      <Main
        style={{
          opacity: 1 - Math.abs(hideProgress),
          willChange: 'opacity',
        }}
      >
        <Content
          style={{
            transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
            willChange: 'transform',
          }}
        >
          <StartContent onCreate={onCreate} onJoin={onJoin} account={account} />
        </Content>
      </Main>
    )
  }
}

class StartContent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Welcome to Aragon
          </Text>
        </Title>
        <Action>
          <p>
            <Text size="large" color={theme.textSecondary}>
              Get started by creating your new decentralized organization
            </Text>
          </p>
          <Button mode="strong" onClick={this.props.onCreate}>
            Create a new organization
          </Button>
        </Action>
        <Action>
          <p>
            <Text size="large" color={theme.textSecondary}>
              Or join an existing one
            </Text>
          </p>
          <Button mode="outline" onClick={this.props.onJoin}>
            Join an existing organization
          </Button>
        </Action>
      </React.Fragment>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  @media (min-width: 1180px) {
    justify-content: flex-start;
    background: url(${logo}) no-repeat calc(100% - 70px) 60%;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Action = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  & + & {
    margin-top: 70px;
  }
  p {
    margin-bottom: 35px;
  }
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

export default Start
