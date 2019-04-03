import styled from 'styled-components'
import { Card, breakpoint } from '@aragon/ui'

const EmptyBlock = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 180px;
  border-left-width: 0;
  border-right-width: 0;
  border-radius: 0;

  ${breakpoint(
    'medium',
    `
      border-left-width: 1px;
      border-right-width: 1px;
      border-radius: 3px;
    `
  )}
`

export default EmptyBlock
