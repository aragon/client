import React from 'react'
import styled from 'styled-components'
import { theme, Button, BreakPoint } from '@aragon/ui'

const StyledButton = styled.button`
  border: none;
  background: none;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:focus {
    border: 2px solid ${theme.accent};
  }

  &:active {
    border: none;
  }
`

export default props => (
  <React.Fragment>
    <BreakPoint to="medium">
      <StyledButton {...props}>
        <svg width="24px" height="24px" viewBox="0 0 24 24" {...props}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </StyledButton>
    </BreakPoint>
    <BreakPoint from="medium">
      <Button mode="strong" {...props}>
        Add permission
      </Button>
    </BreakPoint>
  </React.Fragment>
)
