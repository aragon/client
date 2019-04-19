import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from '@aragon/ui'

export const BANNER_HEIGHT = 38

class Banner extends React.Component {
  render() {
    const { text, textColor, button, color } = this.props
    return (
      <BannerWrapper color={color}>
        <div css="white-space: nowrap">
          <Text color={textColor}>{text}</Text>
        </div>
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
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  height: ${BANNER_HEIGHT}px;
  padding: 6px 10px;
  background-color: ${({ color }) => color};
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 10px;
`

export default Banner
