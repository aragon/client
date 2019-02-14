import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, breakpoint } from '@aragon/ui'

class Banner extends React.Component {
  render() {
    const { text, textColor, button, color } = this.props
    return (
      <BannerWrapper color={color}>
        <Text color={textColor}>{text}</Text>
        <ButtonWrapper>{button}</ButtonWrapper>
      </BannerWrapper>
    )
  }
}
Banner.propTypes = {
  button: PropTypes.node,
  color: PropTypes.string,
  text: PropTypes.node,
  textColor: PropTypes.string,
}

const BannerWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6px 10px;
  background-color: ${({ color }) => color};

  ${breakpoint(
    'medium',
    `
      grid-template-rows: none;
      grid-template-columns: auto auto;
      grid-gap: 10px;
      text-align: left;
    `
  )};
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export default Banner
