import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'
import IconMenu from '../../icons/IconMenu'

const StyledButton = styled.button`
  border: none;
  background: none;
  margin-left: 24px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;

  &:focus {
    border: 2px solid ${theme.accent};
  }
`

export default props => (
  <StyledButton {...props}>
    <IconMenu />
  </StyledButton>
)
