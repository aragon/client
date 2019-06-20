import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { ButtonBase, useTheme } from '@aragon/ui'
import MenuPanelInstance from './MenuPanelInstance'
import { AppInstanceType } from '../../prop-types'
import springs from '../../springs'

const { div: AnimDiv } = animated

class MenuPanelAppGroup extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    activeInstanceId: PropTypes.string,
    expand: PropTypes.bool.isRequired,
    icon: PropTypes.object.isRequired,
    instances: PropTypes.arrayOf(AppInstanceType).isRequired,
    name: PropTypes.string.isRequired,
    onActivate: PropTypes.func.isRequired,
    system: PropTypes.bool,
  }

  handleAppClick = () => {
    const instance = this.props.instances[0]
    if (instance) {
      this.props.onActivate(instance.instanceId)
    }
  }
  handleInstanceClick = instanceId => {
    this.props.onActivate(instanceId)
  }
  render() {
    const {
      name,
      icon,
      system,
      instances,
      activeInstanceId,
      active,
      expand,
      theme,
    } = this.props
    const singleInstance = instances.length === 1
    return (
      <Spring
        config={springs.smooth}
        to={{ openProgress: Number(active && (singleInstance || expand)) }}
        native
      >
        {({ openProgress }) => (
          <Main
            active={active}
            system={system}
            pressedItemBackground={theme.surfacePressed}
            activeItemBackground={theme.surfaceSelected}
          >
            <div
              style={{ opacity: Number(active) }}
              css={`
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                background: ${theme.surfaceInteractive};
              `}
            />

            <AnimDiv
              css={`
                position: absolute;
                width: 4px;
                height: 100%;
                background: ${theme.accent};
              `}
              style={{
                opacity: openProgress,
                transform: openProgress.interpolate(
                  v => `translate3d(-${(1 - v) * 100}%, 0, 0)`
                ),
              }}
            />

            <ButtonItem
              className={`item ${active ? 'active' : ''}`}
              onClick={this.handleAppClick}
            >
              <span>
                <span className="icon">{icon}</span>
                <span className="name">{name}</span>
              </span>
            </ButtonItem>

            {instances.length > 1 && (
              <animated.ul
                className="instances"
                style={{
                  height: openProgress.interpolate(
                    v => `${(instances.length * 30 + 5) * v}px`
                  ),
                  paddingBottom: openProgress.interpolate(v => `${5 * v}px`),
                }}
              >
                {instances.map(({ instanceId, identifier }) => {
                  const label = identifier || instanceId
                  return label ? (
                    <li key={instanceId}>
                      <MenuPanelInstance
                        id={instanceId}
                        name={label}
                        active={instanceId === activeInstanceId}
                        onClick={this.handleInstanceClick}
                      />
                    </li>
                  ) : null
                })}
              </animated.ul>
            )}
          </Main>
        )}
      </Spring>
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
    &.active {
      transition: none;
      background: ${p => p.activeItemBackground};
    }
    &:active {
      background: ${p => p.pressedItemBackground};
    }
  }
  .name {
    font-weight: ${({ active }) => (active ? '800' : '400')};
    font-size: 16px;
  }
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    margin-right: 15px;

    & > img {
      border-radius: 5px;
    }
  }
  .instances {
    overflow: hidden;
    padding: 0 10px 0 30px;
  }
  .instances li {
    display: flex;
  }
`

const ButtonItem = styled(ButtonBase)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 0;
  & > span {
    display: flex;
    flex-wrap: nowrap;
  }
`

export default function(props) {
  const theme = useTheme()
  return <MenuPanelAppGroup {...props} theme={theme} />
}
