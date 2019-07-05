import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { ButtonIcon, GU, IconSettings, Popover } from '@aragon/ui'
import IconNetwork from './IconNetwork'
import IconCustomLabels from './IconCustomLabels'
import IconNotifications from './IconNotifications'
import IconHelpAndFeedback from './IconHelpAndFeedback'

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
          <ListItem
            css={`
              height: 32px;
              color: #637381;
              text-transform: uppercase;
              font-size: 12px;
              padding-left: ${2 * GU}px;
            `}
          >
            Global preferences
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('custom-labels')}
              icon={<IconCustomLabels />}
              label="Custom labels"
            />
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('network')}
              icon={<IconNetwork />}
              label="Network"
            />
          </ListItem>
          <ListItem>
            <Item
              onClick={handleItemClick('notifications')}
              icon={<IconNotifications />}
              label="Notifications"
            />
          </ListItem>
          <ListItem>
            <Item
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

const ListItem = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  height: 56px;
`

export default GlobalSettingsButton
