import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const LoadingRing = ({ spin, ...props }) => (
  <Main spin={spin} {...props}>
    <Ring spin={spin} />
  </Main>
)
LoadingRing.propTypes = {
  spin: PropTypes.bool,
}

const Main = styled.span`
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

const Ring = styled.span`
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
