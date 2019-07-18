import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { theme } from '@aragon/ui'
import color from 'onecolor'
import MenuPanelInstance from './MenuPanelInstance'
import { AppInstanceType } from '../../prop-types'
import springs from '../../springs'
import { useLocalIdentity } from '../../hooks'

function MenuPanelItem({
  active,
  onClick,
  name,
  icon,
  instanceId,
  singleInstance,
}) {
  const [label, setLabel] = useState(name)
  const { name: localIdentity } = useLocalIdentity(instanceId)
  useEffect(() => {
    setLabel((singleInstance && localIdentity) || name)
  }, [singleInstance, localIdentity, name])

  return (
    <ButtonItem
      role="button"
      className={`item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span>
        <span className="icon">{icon}</span>
        <span className="name">{label}</span>
      </span>
    </ButtonItem>
  )
}

MenuPanelItem.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  singleInstance: PropTypes.bool.isRequired,
}

const Item = React.memo(MenuPanelItem)

function MenuPanelAppGroup({
  name,
  icon,
  system,
  instances,
  activeInstanceId,
  active,
  expand,
  onActivate,
}) {
  const handleAppClick = () => {
    const [instance] = instances
    if (instance) {
      onActivate(instance.instanceId)
    }
  }
  const handleInstanceClick = instanceId => onActivate(instanceId)
  const singleInstance = instances.length === 1

  return (
    <Spring
      config={springs.smooth}
      to={{ openProgress: Number(active && (singleInstance || expand)) }}
      native
    >
      {({ openProgress }) => (
        <Main active={active} system={system}>
          <ActiveBackground style={{ opacity: Number(active) }} />

          <MenuItemBar
            style={{
              opacity: openProgress,
              transform: openProgress.interpolate(
                v => `translate3d(-${(1 - v) * 100}%, 0, 0)`
              ),
            }}
          />

          <Item
            instanceId={instances[0].instanceId}
            onClick={handleAppClick}
            icon={icon}
            name={name}
            active={active}
            singleInstance={singleInstance}
          />

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
                      onClick={handleInstanceClick}
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

MenuPanelAppGroup.propTypes = {
  active: PropTypes.bool.isRequired,
  activeInstanceId: PropTypes.string,
  expand: PropTypes.bool.isRequired,
  icon: PropTypes.object.isRequired,
  instances: PropTypes.arrayOf(AppInstanceType).isRequired,
  name: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  system: PropTypes.bool,
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
    filter: ${({ system }) =>
      system ? `brightness(${({ active }) => (active ? 0 : 100)}%)` : 'none'};

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

const ButtonItem = styled.span`
  display: flex;
  justify-content: space-between;
  & > span {
    display: flex;
    flex-wrap: nowrap;
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

const MenuItemBar = styled(animated.div)`
  position: absolute;
  width: 4px;
  height: 100%;
  background: ${theme.accent};
`

export default React.memo(MenuPanelAppGroup)
