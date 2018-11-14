import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Card, unselectable, colors } from '@aragon/ui'
import { noop } from '../../utils'

class HomeCard extends React.Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onActivate: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onActivate: noop,
  }
  handleClick = () => {
    this.props.onActivate(this.props.id)
  }
  noDrag = event => event.preventDefault()
  render() {
    const { title, icon } = this.props
    return (
      <Main
        width="auto"
        height="100%"
        tabIndex="0"
        onClick={this.handleClick}
        onDragStart={this.noDrag}
      >
        <div>
          <img width="60" height="60" src={icon} alt="" />
          <span>{title}</span>
        </div>
      </Main>
    )
  }
}

const Main = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  ${unselectable};
  outline: 0;
  transition: all 100ms ease-in-out;
  border-color: ${colors.Alabaster};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  div {
    display: flex;
    flex-direction: column;
  }
  img {
    display: block;
    margin: 0 auto 15px;
  }
`

export default HomeCard
