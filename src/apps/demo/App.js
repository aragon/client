import React from 'react'
import styled from 'styled-components'
import { AragonApp, Button, EmptyStateCard } from '@aragon/ui'

import icon from './assets/icon-demo.svg'

const Icon = <img src={icon} alt="" />

class App extends React.Component {
  state = {
    counter: 0,
  }
  componentWillMount() {
    window.addEventListener('message', this.handleReceiveMessage, false)
    this.sendMessage({
      method: 'cache',
      payload: {
        mode: 'get',
        key: 'counter',
      },
    })
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage, false)
  }
  handleReceiveMessage = ({ data: { method, payload } }) => {
    if (method === 'cache') {
      this.handleReceiveState(payload)
    }
  }
  handleReceiveState = ({ key, value }) => {
    this.setState({ [key]: value })
  }
  handleSendCall = event => {
    this.sendMessage({
      method: 'call',
      payload: {},
    })
  }
  handleSendError = event => {
    this.sendMessage({
      method: 'error',
      payload: {},
    })
  }
  sendMessage = event => {
    window.parent.postMessage(event, '*')
  }
  render() {
    const { counter } = this.state
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <Main>
          <EmptyStateCard
            actionText={'This is a demo!'}
            icon={() => Icon}
            title={`Demo app state: ${counter}`}
          />
          <Actions>
            <Button mode="strong" onClick={this.handleSendCall}>
              Send Call
            </Button>
            <Button mode="secondary" onClick={this.handleSendError}>
              Send Error
            </Button>
          </Actions>
        </Main>
      </AragonApp>
    )
  }
}

const Main = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  & > *:first-child {
    margin-right: 10px;
  }
`

export default App
