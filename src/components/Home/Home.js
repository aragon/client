import React from 'react'
import { styled, theme, AppBar } from '@aragon/ui'
import HomeCard from './HomeCard'
import Token from './Token'
import PricesBar from './PricesBar'

import imgAssignTokens from './assets/assign-tokens.svg'
import imgFinance from './assets/finance.svg'
import imgGroups from './assets/groups.svg'
import imgPayment from './assets/payment.svg'
import imgTransferTokens from './assets/transfer-tokens.svg'
import imgVote from './assets/vote.svg'

const LARGE_WIDTH = 1300

const CARD_SETTINGS = {
  small: { margin: 20, width: 160, height: 180 },
  large: { margin: 30, width: 220, height: 220 },
}

const apps = [
  ['Transfer Tokens', imgTransferTokens],
  ['Assign Tokens', imgAssignTokens],
  ['Vote', imgVote],
  ['View Groups', imgGroups],
  ['Check Finance', imgFinance],
  ['New Payment', imgPayment],
]

const tokens = [
  { symbol: 'XVT', name: 'Voting Token', amount: '100097995', value: 70 },
  { symbol: 'LIS', name: 'Lorem Ipsum Token', amount: '10002', value: 30 },
]

const prices = [
  { symbol: 'ETH', value: '$302,91', status: 'up' },
  { symbol: 'ANT', value: '$2.39', status: 'down' },
  { symbol: 'DNT', value: '$0.35', status: 'down' },
]

class Home extends React.Component {
  render() {
    return (
      <Main>
        <AppBarWrapper>
          <AppBar title="Welcome!" />
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            <Content>
              <Title>What do you want to do?</Title>
              <Cards>
                {apps.map(([title, icon]) => (
                  <CardWrap key={`${title}_${icon}`}>
                    <HomeCard title={title} icon={icon} />
                  </CardWrap>
                ))}
              </Cards>
            </Content>
            <Sidebar>
              <h1>Your tokens</h1>

              <ul>
                {tokens.map(token => (
                  <li>
                    <Token key={token.symbol} {...token} />
                  </li>
                ))}
              </ul>
            </Sidebar>
          </AppWrapper>
        </ScrollWrapper>
        <AppFooter>
          <PricesBar prices={prices} />
        </AppFooter>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  overflow: auto;
  flex-grow: 1;
`

const AppWrapper = styled.div`
  flex-grow: 1;
  min-height: min-content;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`

const AppFooter = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 54px;
  background: ${theme.contentBackground};
  border-top: 1px solid ${theme.contentBorder};
`

const Content = styled.div`
  padding: 40px;
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 16px;
`

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: calc(
    ${CARD_SETTINGS.small.width}px * 3 + ${CARD_SETTINGS.small.margin}px * 3
  );
  max-width: calc(
    ${CARD_SETTINGS.large.width}px * 3 + ${CARD_SETTINGS.small.margin}px * 3
  );
  margin-left: -${CARD_SETTINGS.small.margin}px;

  @media (min-width: ${LARGE_WIDTH}px) {
    min-width: calc(
      ${CARD_SETTINGS.small.width}px * 3 + ${CARD_SETTINGS.large.margin}px * 3
    );
    max-width: calc(
      ${CARD_SETTINGS.large.width}px * 3 + ${CARD_SETTINGS.large.margin}px * 3
    );
    margin-left: -${CARD_SETTINGS.large.margin}px;
  }
`

const CardWrap = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: calc(100% / 3 - ${CARD_SETTINGS.small.margin}px);
  height: ${CARD_SETTINGS.small.height}px;
  margin-top: ${CARD_SETTINGS.small.margin}px;
  margin-left: ${CARD_SETTINGS.small.margin}px;

  @media (min-width: ${LARGE_WIDTH}px) {
    width: calc(100% / 3 - ${CARD_SETTINGS.large.margin}px);
    height: ${CARD_SETTINGS.large.height}px;
    margin-top: ${CARD_SETTINGS.large.margin}px;
    margin-left: ${CARD_SETTINGS.large.margin}px;
  }
`

const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 364px;
  min-height: 100%;
  padding: 40px 30px;
  background: #edf3f6;

  h1 {
    padding-bottom: 5px;
    color: ${theme.textSecondary};
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid ${theme.contentBorder};
  }
  li {
    margin-top: 30px;
    list-style: none;
  }
`

export default Home
