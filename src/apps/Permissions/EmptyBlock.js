import styled from 'styled-components'
import { Box, textStyle } from '@aragon/ui'

const EmptyBlock = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  ${textStyle('body2')}
`

export default EmptyBlock
