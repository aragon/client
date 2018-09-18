import React from 'react'
import styled from 'styled-components'
import { SafeLink, Text, Info } from '@aragon/ui'

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
          <Error>
            <h1>
              <Text size="xxlarge">An unexpected error has occured</Text>
            </h1>
            <TryAgain>
              <p>
                Try to <a href="/">reload the application</a> or{' '}
                <SafeLink href="https://aragon.chat/" _target="_blank">
                  contact us
                </SafeLink>{' '}
                if the problem persists.
              </p>
            </TryAgain>
            <Message>{error.message}</Message>
            {errorStack && (
              <Details>
                <DetailsLabel>More details…</DetailsLabel>
                <DetailsOutput>{errorStack}</DetailsOutput>
              </Details>
            )}
          </Error>
        </In>
      </Main>
    )
  }
}

const Main = styled.div`
  height: 100vh;
  overflow-y: auto;
`

const In = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  min-height: 100%;
`

const Error = styled.div`
  flex-basis: 600px;
  max-width: 600px;
  min-width: 100px;
  padding: 40px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 1px 0 15px rgba(0, 0, 0, 0.1);
  & > h1 {
    margin-bottom: 40px;
  }
`

const TryAgain = styled.div`
  margin-bottom: 40px;
`

const Message = styled(Info)`
  margin-bottom: 20px;
  overflow: auto;
`

const Details = styled.details`
  margin: 20px 0;
`

const DetailsLabel = styled.summary`
  display: inline;
  text-decoration: underline;
  cursor: pointer;
  &::-webkit-details-marker {
    display: none;
  }
`

const DetailsOutput = styled(Info)`
  display: block;
  overflow: auto;
  margin-top: 20px;
  white-space: pre;
  background: #f6f6f6;
`

export default GlobalErrorHandler
