import React from 'react'
import { styled, theme, font } from '@aragon/ui'
import { distanceInWordsStrict, format } from 'date-fns'

const NotificationItem = ({ title, description, date, unread }) => (
  <Main>
    {unread && <Unread />}
    <Header>
      <Title>{title}</Title>
      <Time datetime={format(date)}>
        {`${distanceInWordsStrict(date, new Date())} ago`}
      </Time>
    </Header>
    <p>{description}</p>
  </Main>
)

NotificationItem.defaultProps = {
  unread: false,
}

const Main = styled.div`
  position: relative;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`
const Title = styled.h2`
  ${font({ size: 'large', weight: 'bold' })};
`
const Time = styled.time`
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall', weight: 'bold' })};
`
const Unread = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  width: 5px;
  height: 5px;
  background: ${theme.positive};
  border-radius: 2.5px;
`

export default NotificationItem
