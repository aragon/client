import styled from 'styled-components'
import { Button, GU } from '@aragon/ui'

const SignerButton = styled(Button).attrs({
  mode: 'strong',
  wide: true,
})`
  margin-top: ${3 * GU}px;
`

export default SignerButton
