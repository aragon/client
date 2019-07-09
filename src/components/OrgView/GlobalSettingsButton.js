import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ButtonIcon, GU, IconSettings, Popover, theme } from '@aragon/ui'
import IconNetwork from './IconNetwork'
import IconCustomLabels from './IconCustomLabels'
import IconNotifications from './IconNotifications'
import IconHelpAndFeedback from './IconHelpAndFeedback'

function GlobalSettingsButton({ onOpen }) {
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
          `}
        >
          <li
            css={`
              display: flex;
              align-items: center;
              height: 32px;
              color: #637381;
              text-transform: uppercase;
              font-size: 12px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid #dfe3e8;
            `}
          >
            Global preferences
          </li>
          <ListItem>
            <ItemMemo
              onClick={handleItemClick('custom-labels')}
              icon={<IconCustomLabels />}
              label="Custom labels"
            />
          </ListItem>
          <ListItem>
            <ItemMemo
              onClick={handleItemClick('network')}
              icon={<IconNetwork />}
              label="Network"
            />
          </ListItem>
          <ListItem>
            <ItemMemo
              onClick={handleItemClick('notifications')}
              icon={<IconNotifications />}
              label="Notifications"
            />
          </ListItem>
          <ListItem>
            <ItemMemo
              onClick={handleItemClick('help-and-feedback')}
              icon={<IconHelpAndFeedback />}
              label="Help & Feedback"
            />
          </ListItem>
        </ul>
      </Popover>
    </React.Fragment>
  )
}

GlobalSettingsButton.propTypes = {
  onOpen: PropTypes.func.isRequired,
}

function Item({ icon, label, onClick }) {
  return (
    <ButtonIcon
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding: ${2 * GU}px;
        justify-content: left;
      `}
      onClick={onClick}
      label={label}
    >
      {icon}
      <span css={icon && `margin-left: ${1 * GU}px;`}>{label}</span>
    </ButtonIcon>
  )
}

Item.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

const ItemMemo = React.memo(Item)

const ListItem = styled.li`
  display: flex;
  align-items: center;
  border-left: 2px solid transparent;
  border-bottom: 1px solid #dfe3e8;
  height: 56px;

  &:hover,
  &:focus {
    outline: none;
    background: #f9fafc;
    border-left: 2px solid ${theme.accent};
  }
`

export default React.memo(GlobalSettingsButton)
