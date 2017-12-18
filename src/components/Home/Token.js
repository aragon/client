import React from 'react'
import { styled, theme } from '@aragon/ui'
import CircleGraph from '../CircleGraph'

const Token = ({ symbol, name, amount, value }) => (
  <Main>
    <CircleGraph value={value / 100} />
    <TextContent>
      <Symbol>{symbol}</Symbol>
      <Name>{name}</Name>
      <Amount>
        {amount} {symbol}
      </Amount>
    </TextContent>
  </Main>
)

const Main = styled.div`
  display: flex;
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  justify-content: space-between;
`

const Symbol = styled.h2`
  color: ${theme.accent};
  font-weight: 600;
  text-transform: lowercase;
  font-variant: small-caps;
`

const Name = styled.p`
  font-weight: 600;
`

const Amount = styled.p`
  white-space: nowrap;
`

export default Token
