import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

class LoadingRing extends React.Component {
  render() {
    const { spin } = this.props
    return (
      <Main spin={spin}>
        <Ring spin={spin} />
      </Main>
    )
  }
}

const Main = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: ${({ spin }) => (spin ? 'spin 1s infinite linear' : 'none')};
`

const Ring = styled.div`
  position: relative;
  overflow: ${({ spin }) => (spin ? 'hidden' : 'visible')};
  width: 10px;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid ${theme.accent};
  }
`

export default LoadingRing
