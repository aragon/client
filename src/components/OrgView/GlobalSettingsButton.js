import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  ButtonBase,
  ButtonIcon,
  GU,
  IconSettings,
  Popover,
} from '@aragon/ui'

const networkIcon = <IconSettings />
const customLabelsIcon = <IconSettings />
const notificationIcon = <IconSettings />
const helpFeedbackIcon = <IconSettings />

function GlobalSettingsButton({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const handleToggle = () => {
    setOpened(!opened)
  }
  const handleClose = () => {
    setOpened(false)
  }
  const handleItemClick = path => () => {
    setOpened(false)
    onOpen(path)
  }

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon onClick={handleToggle} css="height:100%;">
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
          <ListItem>Global preferences</ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('custom-labels')}
              icon={customLabelsIcon}
              label="Custom labels"
            />
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('network')}
              icon={networkIcon}
              label="Network"
            />
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('notifications')}
              icon={notificationIcon}
              label="Notifications"
            />
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('help-and-feedback')}
              icon={helpFeedbackIcon}
              label="Help & Feedback"
            />
          </ListItem>
        </ul>
      </Popover>
    </React.Fragment>
  )
}

function Item({ icon, label, onClick }) {
  return (
    <ButtonBase
      css={`
        width: 100%;
        display: flex;
        align-items: flex-end;
      `}
      onClick={onClick}
    >
      {icon}
      <span css={icon && `margin-left: ${1 * GU}px;`}>{label}</span>
    </ButtonBase>
  )
}

const ListItem = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  padding: ${2 * GU}px;
  height: 56px;
`

export default GlobalSettingsButton
