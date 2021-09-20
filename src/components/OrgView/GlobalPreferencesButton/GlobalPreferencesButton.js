import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconSettings,
  Popover,
  RADIUS,
  Switch,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { useClientTheme } from '../../../client-theme'
import { useRouting } from '../../../routing'

import iconNetwork from '../../../assets/global-preferences-network.svg'
import iconCustomLabels from '../../../assets/global-preferences-custom-labels.svg'
import iconNotifications from '../../../assets/global-preferences-notifications.svg'
import { useWallet } from '../../../contexts/wallet'
import { isOnEthMainnet } from '../../../util/network'

function GlobalPreferencesButton() {
  const theme = useTheme()
  const clientTheme = useClientTheme()
  const { below } = useViewport()
  const routing = useRouting()

  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const { networkType } = useWallet()
  const isMainnet = isOnEthMainnet(networkType)

  const handleToggle = useCallback(() => setOpened(opened => !opened), [])
  const handleClose = useCallback(() => setOpened(false), [])
  const handleItemClick = useCallback(
    path => {
      setOpened(false)
      routing.update(locator => ({
        ...locator,
        preferences: { section: path },
      }))
    },
    [routing]
  )

  const toggleDarkMode = useCallback(() => {
    clientTheme.toggleAppearance()
  }, [clientTheme])

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          css={`
            width: ${4.25 * GU}px;
            height: 100%;
            border-radius: 0;
          `}
          label="Global preferences"
        >
          <IconSettings
            css={`
              color: ${theme.hint};
            `}
          />
        </ButtonIcon>
      </div>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <ul
          css={`
            /* Use 20px as the padding setting for popper is 10px */
            width: ${below('medium') ? `calc(100vw - 20px)` : `${42 * GU}px`};
            padding: 0;
            margin: 0;
            list-style: none;
            background: ${theme.surface};
            color: ${theme.content};
            border-radius: ${RADIUS}px;
          `}
        >
          <li
            css={`
              display: flex;
              align-items: center;
              height: ${4 * GU}px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid ${theme.border};
              ${textStyle('label2')}
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Global preferences
          </li>
          <Item
            onClick={() => handleItemClick('custom-labels')}
            icon={iconCustomLabels}
            label="Custom labels"
          />
          {isMainnet && (
            <Item
              onClick={() => handleItemClick('network')}
              icon={iconNetwork}
              label="Network"
            />
          )}
          <Item
            onClick={() => handleItemClick('notifications')}
            icon={iconNotifications}
            label="Notifications"
          />
          <Item
            onClick={toggleDarkMode}
            label={
              <React.Fragment>
                <div
                  css={`
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  `}
                >
                  <span>Dark mode</span>
                  <Switch checked={clientTheme.appearance === 'dark'} />
                </div>
              </React.Fragment>
            }
          />
        </ul>
      </Popover>
    </React.Fragment>
  )
}

function Item({ icon, label, onClick, lastItem }) {
  const theme = useTheme()

  return (
    <li
      css={`
        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
    >
      <ButtonBase
        onClick={onClick}
        label={label}
        css={`
          width: 100%;
          height: ${7 * GU}px;
          border-radius: 0;
        `}
      >
        <div
          css={`
            display: flex;
            width: 100%;
            height: 100%;
            padding: ${2 * GU}px;
            justify-content: left;
            align-items: center;

            &:active,
            &:focus {
              background: ${theme.surfacePressed};
            }
          `}
        >
          {icon && <img src={icon} alt="" />}
          <div
            css={`
              flex-grow: 1;
              display: flex;
              align-items: center;
              margin-left: ${icon ? 1 * GU : 0}px;
            `}
          >
            {label}
          </div>
        </div>
      </ButtonBase>
    </li>
  )
}

Item.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  lastItem: PropTypes.bool,
}

export default React.memo(GlobalPreferencesButton)
