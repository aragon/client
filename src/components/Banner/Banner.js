import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@aragon/ui'

const WrapBanner = styled.div`
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 1em;
  align-items: center;
  justify-content: center;
  padding: 6px 1em;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

const Banner = ({ text, textColor, btnText, onClick, backgroundColor }) => (
  <WrapBanner backgroundColor={backgroundColor}>
    <Text weight="bold" color={textColor}>
      {text}
    </Text>
    <Button compact onClick={onClick}>
      <Text weight="bold">{btnText}</Text>
    </Button>
  </WrapBanner>
)

export default Banner
