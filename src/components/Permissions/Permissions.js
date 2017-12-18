import React from 'react'
import { styled, AppBar } from '@aragon/ui'

class Permissions extends React.Component {
  render() {
    return (
      <Main>
        <AppBarWrapper>
          <AppBar title="Permissions" />
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            <Content />
          </AppWrapper>
        </ScrollWrapper>
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

const Content = styled.div`
  width: 100%;
  padding: 40px;
`

export default Permissions
