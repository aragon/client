import React from 'react'
import { spring, Motion } from 'react-motion'
import { styled, theme, spring as springConf } from '@aragon/ui'

class MenuPanelItem extends React.Component {
  handleClick = () => {
    this.props.onActivate(this.props.id)
  }
  render() {
    const { active, icon, name } = this.props
    return (
      <Main onClick={this.handleClick} active={active}>
        <Motion
          style={{
            openProgress: spring(Number(active), springConf('fast')),
          }}
        >
          {({ openProgress }) => (
            <MenuItemBar
              style={{
                transform: `translateX(-${(1 - openProgress) * 100}%)`,
              }}
            />
          )}
        </Motion>
        <span className="icon">{icon}</span>
        <span className="name">{name}</span>
      </Main>
    )
  }
}

const Main = styled.a.attrs({ role: 'button', tabIndex: '0' })`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  cursor: pointer;
  outline: 0;
  .name {
    font-weight: ${({ active }) => (active ? '600' : '400')};
  }
  .icon {
    display: flex;
    margin-right: 15px;
    color: ${({ active }) =>
      active ? theme.textPrimary : theme.textSecondary};
  }
  &:hover .icon {
    color: ${theme.textPrimary};
  }
`

const MenuItemBar = styled.div`
  position: absolute;
  width: 4px;
  height: 100%;
  margin-left: -30px;
  background: ${theme.accent};
`

export default MenuPanelItem
