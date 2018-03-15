import React from 'react'
import styled from 'styled-components'
import { theme, Text, Button } from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import logo from './assets/logo-welcome.svg'

class Start extends React.PureComponent {
  static defaultProps = {
    hideProgress: 0,
    onCreate: noop,
    onJoin: noop,
  }
  render() {
    const { onCreate, onJoin, hideProgress } = this.props
    return (
      <Main style={{ opacity: 1 - Math.abs(hideProgress) }}>
        <Content
          style={{
            willChange: 'transform',
            transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
          }}
        >
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
            <Button mode="strong" onClick={onCreate}>
              Create a new organization
            </Button>
          </Action>

          <Action>
            <p>
              <Text size="large" color={theme.textSecondary}>
                Or join an existing one
              </Text>
            </p>
            <Button mode="outline" onClick={onJoin}>
              Join an existing organization
            </Button>
          </Action>
        </Content>
      </Main>
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
