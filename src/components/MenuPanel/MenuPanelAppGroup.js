import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { ButtonBase, useTheme } from '@aragon/ui'
import MenuPanelInstance from './MenuPanelInstance'
import { AppInstanceType } from '../../prop-types'
import springs from '../../springs'
import { useLocalIdentity } from '../../hooks'

const { div: AnimDiv } = animated

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
    <ButtonItem className={`item ${active ? 'active' : ''}`} onClick={onClick}>
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

const MenuPanelAppGroup = React.memo(function MenuPanelAppGroup({
  name,
  icon,
  system,
  instances,
  activeInstanceId,
  active,
  expand,
  onActivate,
}) {
  const theme = useTheme()

  const handleAppClick = useCallback(() => {
    const instance = instances[0]
    if (instance) {
      onActivate(instance.instanceId)
    }
  }, [instances, onActivate])

  const handleInstanceClick = useCallback(
    instanceId => onActivate(instanceId),
    [onActivate]
  )

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
})

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

export default MenuPanelAppGroup
