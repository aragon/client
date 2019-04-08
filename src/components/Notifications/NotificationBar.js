import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { theme, Badge } from '@aragon/ui'
import { ActivityContext } from '../../contexts/ActivityContext'
import { NotificationHub, Notification } from './NotificationHub'
import springs from '../../springs'

const NotificationBar = ({
  open,
  onBlur,
  onClearAll,
}) => {
  const frameRef = React.createRef()
  const { activities } = React.useContext(ActivityContext)

  React.useEffect(() => {
    frameRef.current[open ? 'focus' : 'blur']()
  })

  const _onBlur = e => {
    let _handler
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        if (_handler) clearTimeout(_handler)
        _handler = setTimeout(() => open && onBlur(), 200)
      }
    }, 0)
  }

  return (
    <Spring
      native
      from={{ x: -300 }}
      to={{ x: open ? 0 : -300 }}
      config={springs.lazy}
    >
      {({ x }) => (
        <NotificationFrame
          ref={frameRef}
          onBlur={_onBlur}
          tabIndex="0"
          style={{
            transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
          }}
        >
          <NotificationHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ marginRight: 10 }}>
                <Text>Activity</Text>
              </h1>
            </div>
            <a onClick={onClearAll}>
              <Text>Clear All</Text>
            </a>
          </NotificationHeader>
          <NotificationHub
            activities={activities}
            keys={activity => activity.transactionHash}
          >
            {NotificationImpl}
          </NotificationHub>
        </NotificationFrame>
      )}
    </Spring>
  )
}

NotificationBar.propTypes = {
  open: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
}

const NotificationImpl = (item, ready) => {
  let payload =
    typeof item.content === 'string' ? <p>{item.content}</p> : item.content
  switch (item.type) {
    case 'transaction':
      return (
        <Notification.Transaction ready={ready} title={item.title}>
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

const Text = styled('span')`
  vertical-align: sub;
`
export default NotificationBar
