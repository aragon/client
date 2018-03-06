import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { theme, spring as springConf, Text, Button } from '@aragon/ui'
import { lerp } from '../math-utils'

class Launch extends React.Component {
  render() {
    const { visible, direction, onConfirm } = this.props
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
                  All done! Your decentralized organization will be ready in a
                  moment.
                </Text>
              </Title>
              <StyledButton mode="strong" onClick={onConfirm}>
                Get Started
              </StyledButton>
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
  text-align: center;
  margin: 0 12% 40px;
`

const StyledButton = styled(Button)`
  width: 170px;
`

export default Launch
