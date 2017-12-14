import React from 'react'
import { styled, Card, unselectable, theme } from '@aragon/ui'

const HomeCard = ({ title, icon }) => (
  <Main title={title} width="auto" height="100%" tabIndex="0">
    <div>
      <img width="60" height="60" src={icon} alt="" />
      <span>{title}</span>
    </div>
  </Main>
)

const Main = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  ${unselectable};
  outline: 0;

  &:active,
  &:focus {
    border-color: ${theme.contentBorderActive};
  }
  div {
    display: flex;
    flex-direction: column;
  }
  img {
    display: block;
    margin: 0 auto 15px;
  }
`

export default HomeCard
