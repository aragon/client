import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { AppBar } from '@aragon/ui'

class AppLayout extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    endContent: PropTypes.node,
    children: PropTypes.node,
  }
  static defaultProps = {
    title: '',
  }
  render() {
    const { title, endContent, children } = this.props
    return (
      <Main>
        <StyledAppBar title={title} endContent={endContent} />
        <ScrollWrapper>
          <Content>{children}</Content>
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
