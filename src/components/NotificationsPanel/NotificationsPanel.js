import React from 'react'
import styled from 'styled-components'
import { theme, font, observe, redraw, BadgeNumber } from '@aragon/ui'
import NotificationItem from './NotificationItem'
import { compose } from '../../utils'

const REDRAW_TIME = 30 * 1000 // refresh dates every 30 sec

class NotificationsPanel extends React.Component {
  static defaultProps = {
    onClearAllNotifications: () => {},
    onOpenNotification: () => {},
  }
  handleOpenNotification = notification => {
    notification.acknowledge && notification.acknowledge()
    this.props.onOpenNotification(notification)
  }
  render() {
    const {
      notifications,
      onClearAllNotifications,
      onOpenNotification: ignoredOnOpenNotification,
      ...props
    } = this.props

    const unread = notifications.filter(({ read }) => !read).length
    return (
      <Main {...props}>
        <Header>
          <Title>
            <span>Notifications</span>
            <BadgeNumber number={unread} title={`${unread} unread messages`} />
          </Title>
          <ActionLink onClick={onClearAllNotifications}>Clear all</ActionLink>
        </Header>
        <Content>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={this.handleOpenNotification}
            />
          ))}
        </Content>
      </Main>
    )
  }
}

const Main = styled.aside`
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  background: #f1f6f8;
  border-right: 1px solid #e8e8e8;
`
const Header = styled.header`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;
`

const Title = styled.h1`
  display: flex;
  align-items: center;
  color: ${theme.textSecondary};
  text-transform: lowercase;
  font-variant: small-caps;
  font-weight: 600;
  & > span:first-child {
    margin-right: 15px;
  }
`

const ActionLink = styled.a`
  text-decoration: underline;
  color: ${theme.textTertiary};
  cursor: pointer;
  ${font({ size: 'small' })};
`

const Content = styled.nav`
  overflow-y: auto;
  height: 100%;
`

const enhance = compose(
  observe(
    observable =>
      observable.map(notifications => ({
        notifications: [...notifications].reverse(),
      })),
    { notifications: [] }
  ),
  redraw(REDRAW_TIME)
)

export default enhance(NotificationsPanel)
