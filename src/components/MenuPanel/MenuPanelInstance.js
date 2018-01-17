import React from 'react'
import styled from 'styled-components'

class MenuPanelInstance extends React.Component {
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
        {name}
      </Main>
    )
  }
}

const Main = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: calc(22px + 15px);
  font-weight: ${({ active }) => (active ? '800' : '400')};
  line-height: 30px;
  font-size: 13px;
  cursor: pointer;
`

export default MenuPanelInstance
