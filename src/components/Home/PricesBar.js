import React from 'react'
import { styled, theme } from '@aragon/ui'

import imgUp from './assets/price-up.svg'
import imgDown from './assets/price-down.svg'

const statusImg = status => {
  if (status === 'up') {
    return <img src={imgUp} alt="Up" />
  }
  if (status === 'down') {
    return <img src={imgDown} alt="Down" />
  }
  return null
}

const PricesBar = ({ prices }) => (
  <Main>
    {prices.map(({ symbol, value, status }) => (
      <Price>
        <Symbol>{symbol}</Symbol>
        {statusImg(status)}
        {value}
      </Price>
    ))}
  </Main>
)

PricesBar.defaultProps = {
  prices: [],
}

const Main = styled.div`
  display: flex;
  padding-left: 30px;
`

const Price = styled.div`
  display: flex;
  margin-left: 40px;
  font-size: 12px;
  font-weight: 600;
  &:first-child {
    margin-left: 0;
  }
  img {
    margin: 0 5px 0 10px;
  }
`

const Symbol = styled.div`
  font-weight: 600;
  text-transform: lowercase;
  font-variant: small-caps;
  color: ${theme.textSecondary};
`

export default PricesBar
