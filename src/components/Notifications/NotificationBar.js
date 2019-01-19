import React from 'react'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Badge } from '@aragon/ui'
import { NotificationHub, Notification } from './NotificationHub'
import springs from '../../springs'

export default function NotificationBar({ open, notifications, onClearAll }) {
  const count = notifications.length
  return (
    <Spring
      native
      from={{ x: -300 }}
      to={{ x: open ? 0 : -300 }}
      config={springs.lazy}
    >
      {props => (
        <NotificationFrame
          tabIndex={0}
          /* ref={r => r && open && r.focus()}
          onBlur={e => notificationOpen && this.handleNotificationPanelClose()} */
          style={{
            transform: props.x.interpolate(x => `translate3d(${x}px,0,0)`),
          }}
        >
          <NotificationHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ marginRight: 10 }}>Activity</h1>
              {count ? <Badge.Notification>{count}</Badge.Notification> : null}
            </div>
            <a href="#" onClick={onClearAll}>
              Clear All
            </a>
          </NotificationHeader>
          <NotificationHub items={notifications} keys={item => item.id}>
            {NotificationImpl}
          </NotificationHub>
        </NotificationFrame>
      )}
    </Spring>
  )
}

function NotificationImpl(item, ready) {
  let payload =
    typeof item.content === 'string' ? <p>{item.content}</p> : item.content
  switch (item.type) {
    case 'transaction':
      return (
        <Notification.Transaction
          ready={ready}
          title={item.title}
          time="10 min ago"
        >
          {payload}
        </Notification.Transaction>
      )
    default:
      return (
        <Notification ready={ready} title={item.title} time="10 min ago">
          {payload}
        </Notification>
      )
  }
}

const NotificationFrame = styled(animated.div)`
  position: absolute;
  width: 254px;
  height: 100%;
  overflow: auto;
  background: #f1f6f8;
  background: #f1f6f8;
  box-shadow: 1px 0 15px 0 #e8e8e8;
  border-right: 1px solid #e8e8e8;
  z-index: 1000;
  outline: 0;
`

const NotificationHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
  & > div > h1 {
    opacity: 0.7;
    font-family: MaisonNeue-Demi;
    font-size: 12px;
    color: #6d777b;
    letter-spacing: 0;
    line-height: 16px;
    text-align: left;
    text-transform: uppercase;
  }
  & > a {
    opacity: 0.9;
    font-family: MaisonNeue-Book;
    font-size: 14px;
    color: #b3b3b3;
    text-align: right;
  }
`
