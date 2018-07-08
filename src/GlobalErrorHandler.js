import React from 'react'
import styled from 'styled-components'
import { SafeLink, Text, colors } from '@aragon/ui'

class GlobalErrorHandler extends React.Component {
  state = { error: null }
  componentDidCatch(error, info) {
    this.setState({ error })
  }
  render() {
    const { error } = this.state
    if (!error) {
      return this.props.children
    }

    console.log({ err: this.state.error })
    return (
      <Main>
        <In>
          <Error>
            <h1>
              <Text size="xxlarge">An unexpected error has occured</Text>
            </h1>
            <Message>{error.message}</Message>
            <p>
              Try to <a href="/">reload the application</a>, or{' '}
              <SafeLink href="https://aragon.chat/" _target="_blank">
                contact us
              </SafeLink>{' '}
              if the problem persists.
            </p>
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
  align-items: center;
  padding: 20px;
  min-height: 100%;
`

const Error = styled.div`
  max-width: 600px;
  padding: 40px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 1px 0 15px rgba(0, 0, 0, 0.1);

  h1 {
    margin-bottom: 20px;
  }
`

const Message = styled.p`
  margin-bottom: 20px;
  padding: 10px;
  background: ${colors.Gold.Beige};
`

export default GlobalErrorHandler
