import React from 'react'
import { styled, Card, unselectable, colors } from '@aragon/ui'

const HomeCard = ({ title, icon }) => (
  <Main width="auto" height="100%" tabIndex="0">
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
  transition: all 100ms ease-in-out;
  border-color: ${colors.Alabaster};
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: translateY(0.5px);
    box-shadow: none;
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
