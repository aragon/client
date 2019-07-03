import React, { useRef, useState } from 'react'
import { Box, Popover } from '@aragon/ui'

const networkIcon = null
const customLabelsIcon = null
const notificationIcon = null
const helpFeedbackIcon = null

function GlobalSettingsButton() {
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef()

  const handleToggle = () => {
    setOpened(!opened)
  }
  const handleClose = () => {
    setOpened(false)
  }
  const handleItemClick = where => () => {
    setOpened(false)
  }

  return (
    <React.Fragment>
      <button onClick={handleToggle} ref={buttonRef}>
        Global Settings
      </button>
      <Popover
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={buttonRef.current}
      >
        <Box heading={'Global preferences'}>
          <ul>
            <li>
              <Item
                onClick={handleItemClick('network')}
                icon={networkIcon}
                label="Network"
              />
            </li>
            <li>
              <Item
                onClick={handleItemClick('customLabels')}
                icon={customLabelsIcon}
                label="Custom labels"
              />
            </li>
            <li>
              <Item
                onClick={handleItemClick('notifications')}
                icon={notificationIcon}
                label="Notifications"
              />
            </li>
            <li>
              <Item
                onClick={handleItemClick('helpFeedback')}
                icon={helpFeedbackIcon}
                label="Help & Feedback"
              />
            </li>
          </ul>
        </Box>
      </Popover>
    </React.Fragment>
  )
}

function Item({ icon, label, onClick }) {
  return (
    <button onClick={onClick}>
      {icon}
      {label}
    </button>
  )
}

export default GlobalSettingsButton
