import React from 'react'
import styled from 'styled-components'
import { AppBar } from '@aragon/ui'

class AppLayout extends React.Component {
  static defaultProps = {
    title: '',
    maxWidth: -1,
  }
  render() {
    const { title, children, maxWidth } = this.props
    return (
      <Main>
        <StyledAppBar title={title} />
        <ScrollWrapper>
          <Content maxWidth={maxWidth}>{children}</Content>
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
  max-width: ${({ maxWidth }) => (maxWidth < 0 ? 'none' : `${maxWidth}px`)};
  min-height: 100%;
  padding: 30px;
`

export default AppLayout
