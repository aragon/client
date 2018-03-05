import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import {
  theme,
  spring as springConf,
  Text,
} from '@aragon/ui'
import { lerp } from '../math-utils'

class Domain extends React.Component {
  state = {
    // canHide: false,
  }
  handleRest = () => {
    this.setState({
      // canHide: !this.props.visible,
    })
  }
  render() {
    const { visible, direction } = this.props
    // const { canHide } = this.state
    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('slow')),
        }}
        onRest={this.handleRest}
      >
        {({ showProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              opacity: showProgress,
            }}
          >
            <Content
              style={{
                transform: `translateX(${lerp(
                  showProgress,
                  50 * (visible ? direction : -direction),
                  0
                )}%)`,
              }}
            >
              <Title>
                <Text size="great" weight="bold" color={theme.textDimmed}>
                  Claim a domain name
                </Text>
              </Title>

              <p>
                <Text size="large" color={theme.textSecondary}>
                  Check if your chosen URL for your organisation is available
                </Text>
              </p>
            </Content>
          </Main>
        )}
      </Motion>
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
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

export default Domain
