import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

class MenuPanelInstance extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onClick(this.props.id)
  }
  render() {
    const { name, active } = this.props
    return (
      <Main
        role="button"
        tabIndex="0"
        active={active}
        onClick={this.handleClick}
      >
        <Label>{name}</Label>
      </Main>
    )
  }
}

const Main = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-left: calc(22px + 15px);
  line-height: 30px;
  font-weight: ${({ active }) => (active ? '800' : '400')};
  font-size: 13px;
  cursor: pointer;
`

const Label = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export default MenuPanelInstance
