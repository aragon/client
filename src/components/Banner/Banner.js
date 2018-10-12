import React from 'react'
import styled from 'styled-components'
import { Text } from '@aragon/ui'

class Banner extends React.Component {
  render() {
    const { text, textColor, button, color } = this.props
    return (
      <WrapBanner color={color}>
        <Text color={textColor}>{text}</Text>
        <div>{button}</div>
      </WrapBanner>
    )
  }
}

const WrapBanner = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 1em;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background-color: ${({ color }) => color};
`

export default Banner
