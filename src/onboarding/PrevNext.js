import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { spring as springConf, Button } from '@aragon/ui'
import { lerp } from '../math-utils'

class PrevNext extends React.Component {
  render() {
    const { onPrev, onNext, visible } = this.props
    return (
      <Motion
        style={{ showProgress: spring(Number(visible), springConf('fast')) }}
      >
        {({ showProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              transform: `translateY(${lerp(showProgress, 40, 0)}px)`,
              opacity: showProgress,
            }}
          >
            <Button mode="text" onClick={onPrev}>
              Back
            </Button>
            <StrongButton mode="strong" onClick={onNext}>
              Next
            </StrongButton>
          </Main>
        )}
      </Motion>
    )
  }
}

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 30px 45px;
`

const StrongButton = styled(Button).attrs({ mode: 'strong' })`
  min-width: 120px;
`

export default PrevNext
