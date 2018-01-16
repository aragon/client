import React from 'react'
import { spring, Motion } from 'react-motion'
import { styled, theme, spring as springConf } from '@aragon/ui'
import MenuPanelInstance from './MenuPanelInstance'
import color from 'onecolor'

class MenuPanelAppGroup extends React.Component {
  static defaultProps = {
    instances: [],
  }
  handleAppClick = () => {
    const firstInstance = this.props.instances[0]
    this.props.onActivate(
      this.props.appId,
      firstInstance ? firstInstance.id : ''
    )
  }
  handleInstanceClick = instanceId => {
    this.props.onActivate(this.props.appId, instanceId)
  }
  render() {
    const {
      appId,
      icon,
      name,
      instances,
      active,
      activeInstanceId,
    } = this.props
    const image = icon || <img src={`/apps-icons/${appId}.svg`} alt="" />
    return (
      <Motion
        style={{
          openProgress: spring(Number(active), springConf('fast')),
        }}
      >
        {({ openProgress }) => (
          <Main active={active}>
            <MenuItemBar
              style={{
                transform: `translateX(-${(1 - openProgress) * 100}%)`,
                opacity: openProgress,
              }}
            />

            <ActiveBackground style={{ opacity: Number(active) }} />

            <a
              role="button"
              tabIndex="0"
              className={`item ${active ? 'active' : ''}`}
              onClick={this.handleAppClick}
            >
              <span className="icon">{image}</span>
              <span className="name">{name}</span>
            </a>

            <ul
              className="instances"
              style={{
                display: instances.length > 1 ? 'block' : 'none',
                height: `${(instances.length * 30 + 5) * openProgress}px`,
                paddingBottom: `${5 * openProgress}px`,
              }}
            >
              {instances.map(({ id, name }) => (
                <li key={name}>
                  <MenuPanelInstance
                    id={id}
                    name={name}
                    active={id === activeInstanceId}
                    onClick={this.handleInstanceClick}
                  />
                </li>
              ))}
            </ul>
          </Main>
        )}
      </Motion>
    )
  }
}

const Main = styled.div`
  position: relative;
  width: 100%;

  a[role='button'] {
    outline: 0;
  }
  .item {
    display: flex;
    align-items: center;
    height: 40px;
    cursor: pointer;
    padding: 0 10px 0 30px;
    transition: background 150ms ease-in-out;
    &:active {
      background: ${color(theme.secondaryBackground)
        .alpha(0.3)
        .cssa()};
    }
    &.active {
      transition: none;
      background: none;
    }
  }
  .name {
    font-weight: ${({ active }) => (active ? '800' : '400')};
  }
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    margin-right: 15px;
    color: ${({ active }) =>
      active ? theme.textPrimary : theme.textSecondary};
  }
  .instances {
    overflow: hidden;
    padding: 0 10px 0 30px;
  }
  .instances li {
    display: flex;
  }
`

const ActiveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: ${color(theme.secondaryBackground)
    .alpha(0.3)
    .cssa()};
`

const MenuItemBar = styled.div`
  position: absolute;
  width: 4px;
  height: 100%;
  background: ${theme.accent};
`

export default MenuPanelAppGroup
