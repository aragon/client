import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@aragon/ui'

const Banner = ({ text, textColor, buttonText, onClick, color }) => (
  <WrapBanner color={color}>
    <Text weight="bold" color={textColor}>
      {text}
    </Text>
    <Button compact onClick={onClick}>
      <Text weight="bold">{buttonText}</Text>
    </Button>
  </WrapBanner>
)

const WrapBanner = styled.div`
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 1em;
  align-items: center;
  justify-content: center;
  padding: 6px 1em;
  background-color: ${({ color }) => color};
`

export default Banner
