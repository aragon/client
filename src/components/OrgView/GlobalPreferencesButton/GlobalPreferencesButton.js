import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconSettings,
  Popover,
  RADIUS,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import IconNetwork from './IconNetwork'
import IconCustomLabels from './IconCustomLabels'
import IconNotifications from './IconNotifications'
import IconHelpAndFeedback from './IconHelpAndFeedback'

function GlobalPreferencesButton({ onOpen }) {
  const theme = useTheme()
  const { below } = useViewport()
  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const handleToggle = useCallback(() => setOpened(opened => !opened), [])
  const handleClose = useCallback(() => setOpened(false), [])
  const handleItemClick = useCallback(
    path => () => {
      setOpened(false)
      onOpen(path)
    },
    [onOpen]
  )

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          css={`
            height: 100%;
            width: ${4.25 * GU}px;
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
          <li
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <Item
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
            <Item
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
            <Item
              onClick={handleItemClick('notifications')}
              icon={<IconNotifications />}
              label="Notifications"
            />
          </li>
          <li>
            <Item
              lastItem
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

GlobalPreferencesButton.propTypes = {
  onOpen: PropTypes.func.isRequired,
}

function Item({ icon, label, onClick, lastItem }) {
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
          ${lastItem &&
            `
              border-bottom-left-radius: ${RADIUS}px;
              border-bottom-right-radius: ${RADIUS}px;
            `}

          &:active,
          &:focus {
            background: ${theme.surfaceSelected};
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
  lastItem: PropTypes.bool,
}

export default React.memo(GlobalPreferencesButton)
