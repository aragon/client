import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring'
import { ButtonBase, GU, textStyle, useTheme, springs } from '@aragon/ui'
import MenuPanelAppInstance, {
  MENU_PANEL_APP_INSTANCE_HEIGHT,
} from './MenuPanelAppInstance'
import { AppInstanceType } from '../../prop-types'
import { useLocalIdentity } from '../../hooks'

export const MENU_ITEM_BASE_HEIGHT = 5 * GU

const { div: AnimDiv } = animated

const MenuPanelAppGroup = React.memo(function MenuPanelAppGroup({
  name,
  icon,
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
        <div
          css={`
            position: relative;
            width: 100%;

            transition: background 150ms ease-in-out;

            ${active
              ? `
                transition: none;
                background: ${theme.surfacePressed};
              `
              : ''}
            &:active {
              background: ${theme.surfacePressed};
            }

            .instances {
              /* 3GU left padding + 3GU icon + 1GU padding to align instance with menu item */
              padding-left: ${7 * GU}px;
              padding-right: ${2 * GU}px;
              overflow: hidden;
              list-style: none;
            }
          `}
        >
          <AnimDiv
            css={`
              position: absolute;
              left: 0;
              width: 3px;
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

          <MenuPanelItem
            active={active}
            icon={icon}
            instanceId={instances[0].instanceId}
            name={name}
            onClick={handleAppClick}
            openProgress={openProgress}
            singleInstance={singleInstance}
          />

          {instances.length > 1 && (
            <animated.ul
              className="instances"
              style={{
                height: openProgress.interpolate(
                  v =>
                    `${(instances.length * MENU_PANEL_APP_INSTANCE_HEIGHT + 0) *
                      v}px`
                ),
              }}
            >
              {instances.map(({ instanceId, identifier }) => {
                const label = identifier || instanceId
                return label ? (
                  <li key={instanceId}>
                    <MenuPanelAppInstance
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
        </div>
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
}

const MenuPanelItem = React.memo(function MenuPanelItem({
  active,
  onClick,
  name,
  icon,
  instanceId,
  openProgress,
  singleInstance,
}) {
  const { name: localIdentity } = useLocalIdentity(instanceId)
  const label = (singleInstance && localIdentity) || name

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        display: flex;
        align-items: center;
        height: ${MENU_ITEM_BASE_HEIGHT}px;
        width: 100%;
        padding: 0 ${2 * GU}px 0 ${3 * GU}px;
        border-radius: 0;
        text-align: left;
        ${active ? 'font-weight: 600' : ''}
      `}
    >
      <span>{icon}</span>
      <span
        css={`
          margin-left: ${1 * GU}px;
          overflow: hidden;
          text-overflow: ellipsis;
          ${textStyle('body2')}
        `}
      >
        {label}
      </span>
    </ButtonBase>
  )
})
MenuPanelItem.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  openProgress: PropTypes.object.isRequired,
  singleInstance: PropTypes.bool.isRequired,
}

export default MenuPanelAppGroup
