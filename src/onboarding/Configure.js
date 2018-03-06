import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import {
  theme,
  spring as springConf,
  Text,
  TextInput,
} from '@aragon/ui'
import { lerp } from '../math-utils'

class Configure extends React.Component {
  render() {
    const { visible, direction } = this.props
    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('slow')),
        }}
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
              <Title>Configure Template</Title>
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

const Field = styled.p`
  display: flex;
  align-items: center;
  margin-top: 40px;
  label {
    margin: 0 15px 0 10px;
  }
`

export default Configure
