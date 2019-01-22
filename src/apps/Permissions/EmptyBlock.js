import styled from 'styled-components'
import { Card, breakpoint } from '@aragon/ui'

const EmptyBlock = styled(Card)`
  margin: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 180px;

  ${breakpoint(
    'medium',
    `
      margin: 0;
      width: 100%;
    `
  )}
`

export default EmptyBlock
