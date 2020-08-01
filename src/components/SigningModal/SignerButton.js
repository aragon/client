import styled from 'styled-components'
import { Button, GU } from '@aragon/ui'

const SignerButton = styled(Button).attrs({
  mode: 'strong',
  wide: true,
})`
  margin-top: ${2 * GU}px;
`

export default SignerButton
