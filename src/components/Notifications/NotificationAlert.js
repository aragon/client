import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { theme, springs, IconNotifications } from '@aragon/ui'

export default class NotificationAlert extends React.PureComponent {
  static propTypes = {
    unreadActivityCount: PropTypes.number.isRequired,
    activitiesOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  }
  handleClick = () => {
    // Only use for opening. Blur event closes the activity panel
    if (!this.props.activitiesOpen) {
      this.props.onClick()
    }
  }

  render() {
    const { unreadActivityCount } = this.props
    const showCount = unreadActivityCount > 0

    return (
      <div className="actions">
        <IconButton
          style={{ height: 22 }}
          role="button"
          tabIndex="0"
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
                  marginLeft: -12,
                  marginTop: -8,
                  transform: props.size
                    .interpolate(
                      [0, 0.2, 0.4, 0.6, 0.8, 1],
                      [1.5, 1, 1.5, 1, 1.5, 1]
                    )
                    .interpolate(s => `scale(${s})`),
                }}
              >
                {showCount && this.props.unreadActivityCount}
              </Badge>
            )}
          </Spring>
        </IconButton>
      </div>
    )
  }
}

const IconButton = styled.span`
  cursor: pointer;
  outline: 0;
`

const Badge = styled(animated.div)`
  display: inline-flex;
  font-weight: 600;
  white-space: nowrap;
  color: ${theme.badgeNotificationForeground};
  background: ${theme.accent};
  overflow: hidden;
  padding-top: 2px;
  letter-spacing: -0.5px;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  line-height: 1.5;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`
