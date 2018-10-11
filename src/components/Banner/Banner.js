import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@aragon/ui'
import { noop } from '../../utils'

class Banner extends React.Component {
  static defaultProps = {
    onClick: noop,
    border: '0',
  }
  render() {
    const { text, textColor, button, buttonText, onClick, color } = this.props
    return (
      <WrapBanner color={color}>
        <Text color={textColor}>{text}</Text>
        {button || (
          <Button onClick={onClick} mode="strong" size="mini">
            {buttonText}
          </Button>
        )}
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
