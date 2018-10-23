import React from 'react'
import styled from 'styled-components'
import ContainerDimensions from 'react-container-dimensions'
import { Spring, animated } from 'react-spring'
import { theme, springs } from '@aragon/ui'

const { accent } = theme

const AppLoadingProgressBar = ({ hide, percent, ...props }) => (
  <Spring
    config={springs.fast}
    from={{ opacity: 0, percentProgress: 0 }}
    to={{
      opacity: Number(!hide),
      percentProgress: percent,
    }}
    native
  >
    {({ opacity, percentProgress }) => (
      <ContainerDimensions>
        {({ width }) => (
          <StyledProgressBar
            style={{
              opacity: opacity,
              width: percentProgress.interpolate(v => `${(width * v) / 100}px`),
            }}
            {...props}
          >
            <StyledProgressPeg />
          </StyledProgressBar>
        )}
      </ContainerDimensions>
    )}
  </Spring>
)

// Mimic nprogress with our own accent colour
const StyledProgressBar = styled(animated.div)`
  position: absolute;
  top: 0;
  height: 2px;
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
