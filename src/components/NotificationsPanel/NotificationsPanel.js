import React from 'react'
import { styled, theme, font, BadgeNumber } from '@aragon/ui'
import NotificationItem from './NotificationItem'

const NotificationsPanel = ({ notifications = [] }) => (
  <Main>
    <Header>
      <Title>
        <span>Notifications</span>
        <BadgeNumber number={4} />
      </Title>
      <ActionLink>Clear all</ActionLink>
    </Header>
    <Content>
      {notifications.map(({ date, title, description, unread }, i) => (
        <NotificationItem
          key={`${date}${i}`}
          date={date}
          title={title}
          description={description}
          unread={unread}
        />
      ))}
    </Content>
  </Main>
)

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
  ul {
    list-style: none;
  }
`

export default NotificationsPanel
