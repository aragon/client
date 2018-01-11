import React from 'react'
import ContainerDimensions from 'react-container-dimensions'
import { styled, theme } from '@aragon/ui'

const { accent } = theme

const AppLoadingProgressBar = props => (
  <ContainerDimensions>
    {({ width }) => (
      <StyledProgressBar width={width} {...props}>
        <StyledProgressPeg />
      </StyledProgressBar>
    )}
  </ContainerDimensions>
)

// Mimic nprogress with our own accent colour
const StyledProgressBar = styled.div`
  position: fixed;
  top: 0;
  height: 2px;
  width: ${({ percent, width }) => `${width * percent / 100}px;`};
  background-color: ${accent};
`

const StyledProgressPeg = styled.div`
  position: absolute;
  right: 0;
  height: 2px;
  width: 20px;
  background-color: ${accent};
  box-shadow: 0 0 10px ${accent}, 0 0 5px ${accent};
  transform: rotate(10deg) translate(0px, -2px);
`

export default AppLoadingProgressBar
