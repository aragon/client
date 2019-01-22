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
        <svg
          width="12"
          height="19"
          viewBox="0 0 12 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M1.61309 1L10.5 8.98756"
            stroke="#EAEAEA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1.45117 17.7673L10.4512 8.97168"
            stroke="#EAEAEA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </StyledButton>
    </BreakPoint>
    <BreakPoint from="medium">
      <Button mode="outline" compact {...props}>
        View details
      </Button>
    </BreakPoint>
  </React.Fragment>
)
