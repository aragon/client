import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconSettings,
  Popover,
  useTheme,
} from '@aragon/ui'
import IconNetwork from './IconNetwork'
import IconCustomLabels from './IconCustomLabels'
import IconNotifications from './IconNotifications'
import IconHelpAndFeedback from './IconHelpAndFeedback'

function GlobalSettingsButton({ onOpen }) {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const handleToggle = useCallback(() => {
    setOpened(!opened)
  }, [setOpened])
  const handleClose = useCallback(() => {
    setOpened(false)
  }, [setOpened])
  const handleItemClick = useCallback(
    path => () => {
      setOpened(false)
      onOpen(path)
    },
    [setOpened, onOpen]
  )

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          onClick={handleToggle}
          css={`
            height: 100%;
            width: 40px;
          `}
          label="Global preferences"
        >
          <IconSettings />
        </ButtonIcon>
      </div>
      <Popover
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <ul
          css={`
            width: 260px;
            padding: 0;
            margin: 0;
            list-style: none;
            background: ${theme.surface};
            color: ${theme.content};
          `}
        >
          <li
            css={`
              display: flex;
              align-items: center;
              height: 32px;
              color: ${theme.surfaceContentSecondary};
              text-transform: uppercase;
              font-size: 12px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid ${theme.border};
            `}
          >
            Global preferences
          </li>
          <li
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <ItemMemo
              onClick={handleItemClick('custom-labels')}
              icon={<IconCustomLabels />}
              label="Custom labels"
            />
          </li>
          <li
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <ItemMemo
              onClick={handleItemClick('network')}
              icon={<IconNetwork />}
              label="Network"
            />
          </li>
          <li
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <ItemMemo
              onClick={handleItemClick('notifications')}
              icon={<IconNotifications />}
              label="Notifications"
            />
          </li>
          <li
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <ItemMemo
              onClick={handleItemClick('help-and-feedback')}
              icon={<IconHelpAndFeedback />}
              label="Help & Feedback"
            />
          </li>
        </ul>
      </Popover>
    </React.Fragment>
  )
}

GlobalSettingsButton.propTypes = {
  onOpen: PropTypes.func.isRequired,
}

function Item({ icon, label, onClick }) {
  const theme = useTheme()

  return (
    <ButtonBase
      css={`
        width: 100%;
        height: 100%;
        height: 56px;
        display: block;
        padding: 0;
        border-radius: 0;
      `}
      onClick={onClick}
      label={label}
    >
      <div
        css={`
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          padding: ${2 * GU}px;
          justify-content: left;
          border-left: 2px solid transparent;

          &:hover,
          &:focus {
            background: ${theme.surfaceSelected};
            border-left: 2px solid ${theme.accent};
          }
        `}
      >
        {icon}
        <span css={icon && `margin-left: ${1 * GU}px;`}>{label}</span>
      </div>
    </ButtonBase>
  )
}

Item.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

const ItemMemo = React.memo(Item)

export default React.memo(GlobalSettingsButton)
