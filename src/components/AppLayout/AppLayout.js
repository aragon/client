import React from 'react'
import styled from 'styled-components'
import { AppBar } from '@aragon/ui'

class AppLayout extends React.Component {
  static defaultProps = {
    title: '',
  }
  render() {
    const { title, children, padding, maxWidth } = this.props
    return (
      <Main>
        <StyledAppBar title={title} />
        <ScrollWrapper>
          <Content maxWidth={maxWidth} padding={padding}>
            {children}
          </Content>
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

const StyledAppBar = styled(AppBar)`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  height: 100%;
  overflow: auto;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

export default AppLayout
