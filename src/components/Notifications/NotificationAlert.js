import React from 'react'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { theme, springs, IconNotifications } from '@aragon/ui'

export default class NotificationAlert extends React.PureComponent {
  state = { opened: false, previousNotifications: 0 }

  static getDerivedStateFromProps(
    { notifications },
    { opened, previousNotifications }
  ) {
    return {
      opened: notifications !== previousNotifications ? false : opened,
      previousNotifications: notifications,
    }
  }

  handleClick = () => {
    this.setState({ opened: true })
    this.props.onClick()
  }

  render() {
    const { notifications } = this.props
    const show = !this.state.opened && notifications > 0
    return (
      <div className="actions">
        <IconButton
          style={{ height: 22 }}
          role="button"
          tabindex={0}
          onClick={this.handleClick}
        >
          <IconNotifications />
          <Spring
            native
            reset
            from={{ opacity: 0, size: 0 }}
            to={{ opacity: show ? 1 : 0, size: 1 }}
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
                {show && notifications}
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
`

const Badge = styled(animated.div)`
  display: inline-flex;
  font-weight: 600;
  white-space: nowrap;
  color: ${theme.badgeNotificationForeground};
  background: ${theme.badgeNotificationBackground};
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
