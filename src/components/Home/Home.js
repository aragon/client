import React from 'react'
import styled from 'styled-components'
import { theme, AppBar, Text } from '@aragon/ui'

import logo from './assets/logo-background.svg'

class Home extends React.Component {
  render() {
    const { connected } = this.props
    return (
      <Main>
        <AppBarWrapper>
          <AppBar title="Welcome!" />
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            <Content>
              <Title>
                <Text size="great" weight="bold">
                  Welcome to Aragon 0.5
                </Text>
              </Title>
              <p>
                <Text color={theme.textSecondary}>
                  Please have a look at the menu to interact with the apps
                  installed with this organization.
                </Text>
              </p>
            </Content>
          </AppWrapper>
        </ScrollWrapper>
        <AppFooter>
          <ConnectionBullet connected={connected} />
          <Text size="xsmall">
            {connected ? 'Connected to the network' : 'Not connected'}
          </Text>
        </AppFooter>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  background-color: ${theme.mainBackground};
  background-image: url(${logo});
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  overflow: auto;
  flex-grow: 1;
`

const AppWrapper = styled.div`
  flex-grow: 1;
  min-height: min-content;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`

const AppFooter = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 54px;
  padding-left: 30px;
  background: ${theme.contentBackground};
  border-top: 1px solid ${theme.contentBorder};
`

const ConnectionBullet = styled.span`
  width: 8px;
  height: 8px;
  margin-top: -2px;
  margin-right: 8px;
  border-radius: 50%;
  background: ${({ connected }) =>
    connected ? theme.positive : theme.negative};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;
  padding: 40px;
  text-align: center;
`

const Title = styled.h1`
  margin-bottom: 30px;
`

export default Home
