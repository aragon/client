import React from 'react'
import styled from 'styled-components'
import { SafeLink } from '@aragon/ui'
import ErrorCard from './components/ErrorCard/ErrorCard'

class GlobalErrorHandler extends React.Component {
  state = { error: null, errorStack: null }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorStack: errorInfo.componentStack
        .replace(/^\n+|\n+$/g, '')
        .replace(/^ {4}/gm, ''),
    })
  }
  render() {
    const { error, errorStack } = this.state
    if (!error) {
      return this.props.children
    }
    return (
      <Main>
        <In>
          <ErrorCard
            title="Oops."
            detailsTitle={error.message}
            detailsContent={errorStack}
            supportUrl="https://github.com/aragon/aragon/issues/new"
            showReloadButton
          >
            Something went wrong and the application crashed. Reloading might
            solve the problem, or you can{' '}
            <SafeLink href="https://github.com/aragon/aragon/issues/new">
              create an issue
            </SafeLink>{' '}
            on GitHub so we can help.
          </ErrorCard>
        </In>
      </Main>
    )
  }
}

const Main = styled.div`
  height: 100vh;
  overflow: auto;
`

const In = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  padding: 50px 20px 20px;
  min-height: 100%;
`

export default GlobalErrorHandler
