import React from 'react'
import { Line } from 'rc-progress'
import ContainerDimensions from 'react-container-dimensions'
import { styled } from '@aragon/ui'

const AppLoadingProgressBar = props => (
  <ContainerDimensions>
    {({ width }) => <StyledProgressBar width={width} {...props} />}
  </ContainerDimensions>
)

const StyledProgressBar = styled(Line).attrs({
  // Mimic ncprogress
  height: '2px',
  strokeColor: '#29d',
  strokeLinecap: 'square',
  trailWidth: '0',
})`
  position: fixed;
  top: 0;
  filter: drop-shadow(0px 0px 5px rgba(44, 154, 219, 0.3))
    drop-shadow(0px 0px 10px rgba(44, 154, 219, 0.1));
`

export default AppLoadingProgressBar
