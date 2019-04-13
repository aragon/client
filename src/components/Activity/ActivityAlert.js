import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { ButtonIcon, IconNotifications, springs, theme } from '@aragon/ui'

class ActivityAlert extends React.PureComponent {
  static propTypes = {
    unreadActivityCount: PropTypes.number.isRequired,
    activitiesOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  getUnreadCount() {
    return Math.min(99, this.props.unreadActivityCount)
  }

  handleClick = () => {
    // Only use for opening. Blur event closes the activity panel.
    if (!this.props.activitiesOpen) {
      this.props.onClick()
    }
  }

  render() {
    const unreadCount = this.getUnreadCount()
    const showCount = unreadCount > 0

    return (
      <ButtonIcon
        css={`
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
        `}
        label="Activity"
        onClick={this.handleClick}
      >
        <IconNotifications />
        <Spring
          native
          reset
          from={{ opacity: 0, size: 0 }}
          to={{ opacity: showCount ? 1 : 0, size: 1 }}
          config={springs.lazy}
        >
          {props => (
            <Badge
              style={{
                ...props,
                position: 'absolute',
                top: '14px',
                right: '12px',
                transform: props.size
                  .interpolate(
                    [0, 0.2, 0.4, 0.6, 0.8, 1],
                    [1.5, 1, 1.5, 1, 1.5, 1]
                  )
                  .interpolate(s => `scale(${s})`),
              }}
            >
              {showCount && unreadCount}
            </Badge>
          )}
        </Spring>
      </ButtonIcon>
    )
  }
}

const Badge = styled(animated.div)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  padding-top: 2px;
  overflow: hidden;
  border-radius: 9px;

  color: ${theme.badgeNotificationForeground};
  background: ${theme.accent};

  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: -0.5px;
`

export default ActivityAlert
